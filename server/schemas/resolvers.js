// DECLARATIONS: model obj -----------------
const { User, Thought } = require('../models');
const { AuthenticationError } = require('apollo-server-express');

//RESOLVers =====================
const resolvers = {
    Query: {
        thoughts: async (_, { username }) => {
            const params = username ? { username } : {};
            return Thought.find(params).sort({ createdAt: -1 });
        },
        thought: async (_, { _id }) => {
            return Thought.findOne({ _id });
        },
        users: async () => {
            return User.find()
                .select('-__v -password')
                .populate('friends')
                .populate('thoughts');
        },
        user: async (_, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
                .populate('friends')
                .populate('thoughts');
        } 
    },
    Mutation: {
        addUser: async (_, args) => {
            const user = await User.create(args);

            return user;
        },
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });

            if  (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            return user;
        }
    }
};

module.exports = resolvers;