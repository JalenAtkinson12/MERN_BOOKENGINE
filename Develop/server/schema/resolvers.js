const {User} = require ("../models");

const {signToken} = require("../utils/auth");
const {AuthenticationError} = require("apollo-server-express");

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({_id: context.user.id})
                .select("-__v -password")
                .populate("books");

                return userData;
            }

            throw new AuthenticationError("Not Logged In!");
        },
    },

    Mutation: {
        addUser: async (parent, args) => {
            try{
                const user = await User.create(args);

                const token = signToken(user);
                return { token, user};
            } catch (err) {
                console.log(err);
            }
        },

        login: async (parent, {email, password}) => {
            const user = await User.findOne({email});

            if(!user) {
                throw new AuthenticationError("Incorrect credentials");
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw) {
                throw new AuthenticationError("Incorrect Credentials");
            }

            const token =signToken(user);
            return {token, user};
        },

        saveBook: async (parent, args, context) => {
            if (context.user) {
                const updateUser = await User.findByIAndUpdatwe(
                    {_id: context.user._id},

                    {$addToSet: {savedBooks: args.input}},
                    {new: true, runValidators: true}
                );

                return updateUser;
            }

            throw new AuthenticationError("You need to be logged in!")
        },

    },
};

module.exports = resolvers;