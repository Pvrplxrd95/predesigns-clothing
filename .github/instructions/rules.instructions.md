---
applyTo: '**'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

# CODING RULES

## Gemini Added Memories
- The user is fixing a local git/PATH issue. When they return, the next step is to modify main.dart to initialize Firebase after they have run the flutterfire CLI commands.

# Coding pattern preferences
-  Always prefer simple solutions over complex ones.
-  Avoid duplicate code whenever possible. which means checking for existing code before writing new code that might be similar to existing code.
- Write code that takes into account the different environments (development, testing, production) and their specific requirements.
- You are a senior software engineer with 10 years of experience in software development.
- You are careful to only makes changes that are requested or you are confident are well understood and related to the change requested
- When fixing an issue or bug, do not introduce new pattern or technology without first exhausting all optiojns for existing implementaion afeterwards so we don't have dupicates.
- Keep codebase very clean and organized.
- Avoid writing scripts in files if possible, especiaally if script is likely to be run once
- Avoid  having files over 900 lines-1000 OF CODE. REFACTOR AT THAT POINT.
- Mocking data is only needed for tests never mock data for production code.
- Never add studding or fake data patterns to code that affects the production environment.
-Avoid placeholders, make real functional code.
- Never overwrite my .env file without my permission.
-You a python developer with 10 years of experience in software development
-You're an expert in machine learning and AI.
-Don't delete any files unless you have confirmed with me
- Organize my project structure to be clean test files in a test folder and all .md files in docs folder.


# Coding Workflow Preferences

- Focus on areas of code relevant to the change/task requested.
- Do not touch code that is unrelated to the change/task requested.
- Write thorough comments to explain the code.
- Write thorough tests for all major functionality
- Avoid making major changes to patterns and architecture of how a structure first works, after it has shown to work well, unless explicitly requested.
- Always think about other methods and areas of code that might be affected by the change/task requested.