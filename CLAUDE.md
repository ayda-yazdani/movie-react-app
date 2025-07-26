# Claude Code Tutorial: Implement Saved Movies Library and User Profile for React Native TMDB App

## Project Context
I have a React Native app that uses the TMDB API to display movies. The current implementation includes:
- Home screen showing top movie thumbnails
- Movie details screen when clicking thumbnails
- Search functionality for finding movies
- Backend powered by Appwrite
- Database tracking search queries and their frequency
- Top 10 ranking based on most searched movies
- Empty "Saved" and "Profile" tabs that need implementation

## Learning Objectives
I want to learn how to:
- Implement user authentication in React Native with Appwrite
- Create a persistent saved movies feature
- Build a user profile system
- Manage user-specific data relationships
- Handle authentication states throughout the app

## Tutorial Requirements

### 1. User Authentication System
Walk me through implementing authentication with Appwrite:
- Explain the authentication flow architecture
- Show me how to create sign up and login screens
- Teach me about session management and persistence
- Explain how to protect routes/screens from unauthenticated access
- Help me understand best practices for handling auth errors

### 2. Saved Movies Library (Saved Tab)
Guide me through building a personal movie library:
- Explain the data model for user-movie relationships
- Show me how to add save/unsave functionality to movie details
- Teach me how to query user-specific saved movies
- Help me implement the UI for the saved movies list
- Explain state synchronization between screens

### 3. User Profile (Profile Tab)
Help me create a comprehensive profile system:
- Show me how to fetch and display user data
- Teach me how to calculate and show user statistics
- Guide me through implementing settings options
- Explain the logout flow and session cleanup
- Help me understand account management features

### 4. Database Design
Teach me about the database structure:
- Explain the relationships between users and saved movies
- Show me how to set up the collections in Appwrite
- Help me understand indexing for performance
- Teach me about data security and permissions

## Teaching Approach
Please:
1. Explain the "why" behind each implementation decision
2. Start with the overall architecture before diving into code
3. Show me one feature at a time, testing as we go
4. Explain any React Native or Appwrite concepts I might not know
5. Point out common pitfalls and how to avoid them
6. Suggest improvements or alternative approaches where relevant

## Step-by-Step Process
I'd like to follow this order:
1. Set up authentication (starting with the backend configuration)
2. Create login/signup UI and logic
3. Implement session management
4. Add save functionality to movie details
5. Build the saved movies tab
6. Create the profile tab with user info
7. Add settings and account management
8. Test everything together

## Key Learning Points
Please ensure I understand:
- How Appwrite authentication works
- State management for auth and user data
- Async data handling in React Native
- Security best practices
- Performance optimization techniques
- Error handling patterns
- Testing strategies for auth features

## What I Want to Achieve
By the end of this tutorial, I want to:
- Understand the full authentication flow
- Know how to implement user-specific features
- Be able to extend these patterns for future features
- Have a solid grasp of Appwrite's capabilities
- Feel confident modifying and maintaining this code

Please start by examining the current codebase structure and then guide me through implementing these features step by step, explaining concepts as we go. Let me know when you're ready to begin and what we'll tackle first.