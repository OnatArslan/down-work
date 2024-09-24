import prisma from '../db/prisma.mjs';
// Here define all controllers for contract model
export const getAllContracts = async (req, res, next) => {
  try {
    let contracts;
    // Write moduler code for each user role
    if (req.user.role === `client`) {
      contracts = await prisma.contract.findMany({
        where: {
          clientId: Number(req.user.id),
        },
        omit: {
          updatedAt: true,
          clientId: true,
          jobId: true,
          freelancerId: true,
        },
        include: {
          freelancer: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          job: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
      });
      // Also modular this place
    } else if (req.user.role === `freelancer`) {
      contracts = await prisma.contract.findMany({
        where: {
          freelancerId: Number(req.user.id),
        },
        // Omit special fields
        omit: {
          updatedAt: true,
          clientId: true,
          jobId: true,
          freelancerId: true,
        },
        include: {
          client: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          // Job field
          job: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
      });
    }
    // Send response
    res.status(200).json({
      status: `success`,
      message: `Here all contracts belongs to you`,
      contracts,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelContract = async (req, res, next) => {
  try {
    let contract;
    let notification;
    if (req.user.role === `client`) {
      try {
        // Try update contract
        contract = await prisma.contract.update({
          where: {
            id: Number(req.params.contractId),
            clientId: Number(req.user.id),
            status: `active`,
          },
          data: {
            status: `cancelled`,
          },
          include: {
            freelancer: {
              select: {
                id: true,
                email: true,
              },
            },
            job: {
              select: {
                title: true,
              },
            },
          },
        });
      } catch (error) {
        return next(new Error(`Can not find active contract`));
        // If this will catch an error here
      }
      notification = await prisma.notification.create({
        data: {
          receiverId: Number(contract.freelancer.id),
          subject: `Cancelled contract`,
          text: `Hey your contract for ${contract.job.title} cancelled.If you have problem contact with us at example@support.com`,
        },
      });
    } else if ((req.user.role = `freelancer`)) {
      try {
        contract = await prisma.contract.update({
          where: {
            id: Number(req.params.contractId),
            freelancerId: Number(req.user.id),
            status: `active`,
          },
          data: {
            status: `cancelled`,
          },
          include: {
            client: {
              select: {
                id: true,
                email: true,
              },
            },
            job: {
              select: {
                title: true,
              },
            },
          },
        });
      } catch (error) {
        return next(new Error(`Can not find active contract`));
      }
      notification = await prisma.notification.create({
        data: {
          receiverId: Number(contract.client.id),
          subject: `Cancelled contract`,
          text: `Hey your contract for ${contract.job.title} cancelled.If you have problem contact with us at example@support.com`,
        },
      });
    }
    // Send response with 200 OK
    res.status(200).json({
      status: `success`,
      contract,
      notification,
    });
  } catch (error) {
    next(error);
  }
};

export const complateContract = async (req, res, next) => {
  try {
    let contract;
    let notification;
    if (req.user.role === `client`) {
      try {
        contract = await prisma.contract.update({
          where: {
            id: Number(req.params.contractId),
            clientId: Number(req.user.id),
            status: `active`,
          },
          data: {
            status: `complated`,
          },
          include: {
            freelancer: {
              select: {
                username: true,
                email: true,
              },
            },
            job: {
              select: {
                title: true,
              },
            },
          },
        });
      } catch (error) {
        return next(new Error(`Can not find any active contract`));
      }
      notification = await prisma.notification.create({
        data: {
          subject: `Complated contract`,
          text: `Hey ${req.user.username} recantly set complated yours contract for ${contract.job.title} post.
          If something wrong please reach us at example@support.com`,
          receiverId: Number(contract.freelancerId),
        },
      });
    }

    res.status(200).json({
      status: `success`,
      contract,
      notification,
    });
  } catch (error) {
    next(error);
  }
};
