import { PrismaClient, FriendshipStatus, PostVisibility, ReactionType } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create users
  console.log('Creating users...');
  const users = await Promise.all(
    Array.from({ length: 20 }, async (_, i) => {
      return prisma.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          handle: `${faker.internet.userName()}${i}`,
          bio: faker.lorem.sentences(2),
          avatarUrl: faker.image.avatar(),
          coverUrl: faker.image.url(),
        },
      });
    })
  );

  // Create friendships
  console.log('Creating friendships...');
  for (let i = 0; i < users.length; i++) {
    const friendCount = faker.number.int({ min: 2, max: 8 });
    const potentialFriends = users.filter((_, index) => index !== i);
    const friends = faker.helpers.arrayElements(potentialFriends, friendCount);

    for (const friend of friends) {
      const exists = await prisma.friendship.findFirst({
        where: {
          OR: [
            { requesterId: users[i].id, addresseeId: friend.id },
            { requesterId: friend.id, addresseeId: users[i].id },
          ],
        },
      });

      if (!exists) {
        await prisma.friendship.create({
          data: {
            requesterId: users[i].id,
            addresseeId: friend.id,
            status: faker.helpers.arrayElement([
              FriendshipStatus.PENDING,
              FriendshipStatus.ACCEPTED,
            ]),
          },
        });
      }
    }
  }

  // Create posts
  console.log('Creating posts...');
  const posts = await Promise.all(
    Array.from({ length: 100 }, async () => {
      const author = faker.helpers.arrayElement(users);
      const hasMedia = faker.datatype.boolean(0.3);
      const media = hasMedia
        ? [
            {
              url: faker.image.url(),
              type: 'image',
              width: 800,
              height: 600,
            },
          ]
        : [];

      return prisma.post.create({
        data: {
          authorId: author.id,
          content: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 3 })),
          media,
          visibility: faker.helpers.arrayElement([
            PostVisibility.PUBLIC,
            PostVisibility.FRIENDS,
          ]),
          createdAt: faker.date.recent({ days: 30 }),
        },
      });
    })
  );

  // Create reactions
  console.log('Creating reactions...');
  for (const post of posts) {
    const reactionCount = faker.number.int({ min: 0, max: 15 });
    const reactors = faker.helpers.arrayElements(users, reactionCount);

    for (const reactor of reactors) {
      const exists = await prisma.reaction.findUnique({
        where: {
          postId_userId: {
            postId: post.id,
            userId: reactor.id,
          },
        },
      });

      if (!exists) {
        await prisma.reaction.create({
          data: {
            postId: post.id,
            userId: reactor.id,
            type: ReactionType.LIKE,
          },
        });
      }
    }
  }

  // Create comments
  console.log('Creating comments...');
  const comments = [];
  for (const post of posts) {
    const commentCount = faker.number.int({ min: 0, max: 8 });
    for (let i = 0; i < commentCount; i++) {
      const commenter = faker.helpers.arrayElement(users);
      const comment = await prisma.comment.create({
        data: {
          postId: post.id,
          authorId: commenter.id,
          content: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
        },
      });
      comments.push(comment);
    }
  }

  // Create comment replies
  console.log('Creating comment replies...');
  for (const comment of comments.slice(0, 20)) {
    const replyCount = faker.number.int({ min: 0, max: 3 });
    for (let i = 0; i < replyCount; i++) {
      const replier = faker.helpers.arrayElement(users);
      await prisma.comment.create({
        data: {
          postId: comment.postId,
          authorId: replier.id,
          content: faker.lorem.sentences(1),
          parentCommentId: comment.id,
        },
      });
    }
  }

  // Create chats
  console.log('Creating chats...');
  const chats = [];

  // Create 1:1 chats
  for (let i = 0; i < 30; i++) {
    const [user1, user2] = faker.helpers.arrayElements(users, 2);
    const chat = await prisma.chat.create({
      data: {
        isGroup: false,
        members: {
          create: [
            { userId: user1.id, role: 'MEMBER' },
            { userId: user2.id, role: 'MEMBER' },
          ],
        },
      },
    });
    chats.push(chat);
  }

  // Create group chats
  for (let i = 0; i < 10; i++) {
    const memberCount = faker.number.int({ min: 3, max: 8 });
    const members = faker.helpers.arrayElements(users, memberCount);
    const owner = members[0];

    const chat = await prisma.chat.create({
      data: {
        name: faker.company.name(),
        isGroup: true,
        members: {
          create: members.map((member, index) => ({
            userId: member.id,
            role: index === 0 ? 'OWNER' : 'MEMBER',
          })),
        },
      },
    });
    chats.push(chat);
  }

  // Create messages
  console.log('Creating messages...');
  for (const chat of chats) {
    const messageCount = faker.number.int({ min: 5, max: 50 });
    const chatMembers = await prisma.chatMember.findMany({
      where: { chatId: chat.id },
      include: { user: true },
    });

    for (let i = 0; i < messageCount; i++) {
      const sender = faker.helpers.arrayElement(chatMembers);
      const hasMedia = faker.datatype.boolean(0.1);
      const media = hasMedia
        ? [
            {
              url: faker.image.url(),
              type: 'image/jpeg',
              size: faker.number.int({ min: 100000, max: 1000000 }),
              name: `${faker.system.fileName()}.jpg`,
            },
          ]
        : [];

      await prisma.message.create({
        data: {
          chatId: chat.id,
          senderId: sender.userId,
          content: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
          media,
          createdAt: faker.date.recent({ days: 7 }),
        },
      });
    }
  }

  // Create notifications
  console.log('Creating notifications...');
  for (const user of users.slice(0, 10)) {
    const notificationCount = faker.number.int({ min: 5, max: 20 });
    for (let i = 0; i < notificationCount; i++) {
      const sender = faker.helpers.arrayElement(users.filter(u => u.id !== user.id));
      const type = faker.helpers.arrayElement([
        'FRIEND_REQUEST',
        'FRIEND_ACCEPT',
        'POST_LIKE',
        'POST_COMMENT',
        'MESSAGE',
      ]);

      let data = {};
      switch (type) {
        case 'FRIEND_REQUEST':
          data = { friendshipId: faker.string.uuid() };
          break;
        case 'POST_LIKE':
          const likedPost = faker.helpers.arrayElement(posts);
          data = { postId: likedPost.id };
          break;
        case 'POST_COMMENT':
          const commentedPost = faker.helpers.arrayElement(posts);
          data = { postId: commentedPost.id, commentId: faker.string.uuid() };
          break;
        case 'MESSAGE':
          const messageChat = faker.helpers.arrayElement(chats);
          data = { chatId: messageChat.id };
          break;
      }

      await prisma.notification.create({
        data: {
          userId: user.id,
          senderId: sender.id,
          type: type as any,
          data,
          readAt: faker.datatype.boolean(0.6) ? faker.date.recent({ days: 3 }) : null,
        },
      });
    }
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });