import DataLoader from 'dataloader';
import { FastifyInstance } from 'fastify';
import { MemberTypeId } from '../../member-types/schemas.js';

export function createLoaders(fastify: FastifyInstance) {
    const { prisma } = fastify;
    return {
        users: new DataLoader(async (ids: readonly string[]) => {
            const allusers = await prisma.user.findMany({
                where: { id: { in: ids as string[] } },
            });

            const usersmap = allusers.reduce((acc, u) => {
                acc[u.id] ? acc[u.id].push(u) : (acc[u.id] = [u]);
                return acc;
            }, {});

            return ids.map((id) => usersmap[id]);

        }),
        profiles: new DataLoader(async (ids: readonly string[]) => {
            const allprofiles = await prisma.profile.findMany({ where: { userId: { in: ids as string[] } } })


            return ids.map((id) => allprofiles.find(p => p.userId === id))

        }),
        posts: new DataLoader(async (ids: readonly string[]) => {
            const allposts = await prisma.post.findMany({ where: { authorId: { in: ids as string[] } } })

            return ids.map(id => allposts.filter((p) => p.authorId === id))

        }),
        memberTypes: new DataLoader(async (ids: readonly MemberTypeId[]) => {
            const allmemtypes = await prisma.memberType.findMany({
                where:
                    { id: { in: ids as string[] } }
            })

            const memtypesmap = {}
            allmemtypes.forEach(m => memtypesmap[m.id] = m)

            return ids.map((id) => memtypesmap[id])

        }),

        userSubscribedTo: new DataLoader(async (ids: readonly string[]) => {
            const allsubs = await prisma.user.findMany({
                where: {
                    subscribedToUser: {
                        some: {
                            subscriberId: { in: ids as string[] },
                        },
                    },
                }, include: { subscribedToUser: true, userSubscribedTo: true }
            })

            return ids.map((id) => allsubs.filter((sub) => sub.subscribedToUser.some((s) => s.subscriberId === id)))

        }),
        subscribedToUser: new DataLoader(async (ids: readonly string[]) => {
            const allsubs = await prisma.user.findMany({
                where: {
                    userSubscribedTo: {
                        some: {
                            authorId: { in: ids as string[] },
                        },
                    },
                }, include: { userSubscribedTo: true, subscribedToUser: true }
            })

            return ids.map((id) => allsubs.filter((sub) => sub.userSubscribedTo.some((s) => s.authorId === id)))

        }),
    };
}
