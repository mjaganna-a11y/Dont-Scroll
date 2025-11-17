# Contributing to Unfreeze - Anti Doom Scroll App

Thank you for considering contributing to Unfreeze! This document provides guidelines for contributing to the project.

## 🌟 Ways to Contribute

### 1. Report Bugs
- Use GitHub Issues to report bugs
- Include detailed steps to reproduce
- Provide screenshots if applicable
- Mention your device/OS version

### 2. Suggest Features
- Open a GitHub Issue with the "enhancement" label
- Describe the feature and its benefits
- Explain use cases
- Consider providing mockups

### 3. Improve Documentation
- Fix typos or unclear explanations
- Add examples or clarifications
- Translate documentation
- Improve code comments

### 4. Add Task Templates
- Create new task templates for existing categories
- Propose new interest categories
- Ensure content is educational and valuable
- Follow template structure guidelines

### 5. Submit Code
- Fix bugs
- Implement new features
- Improve performance
- Add tests
- Refactor code

## 🔧 Development Setup

### Prerequisites
- Node.js (v16+)
- React Native development environment
- Git

### Setup Steps
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Dont-Scroll.git
   cd Dont-Scroll
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

For detailed setup, see [SETUP.md](./SETUP.md)

## 📝 Coding Standards

### JavaScript Style Guide
- Use ES6+ features
- 2 spaces for indentation
- Single quotes for strings
- Semicolons at end of statements
- Trailing commas in objects/arrays

### Naming Conventions
- **Components**: PascalCase (`HomeScreen.js`)
- **Functions**: camelCase (`generateTasks()`)
- **Constants**: UPPER_SNAKE_CASE (`TASK_TYPE`)
- **Files**: Match component name

### Code Organization
```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

// 2. Component definition
export default function MyComponent() {
  // 3. State declarations
  const [state, setState] = useState(null);
  
  // 4. Effects
  useEffect(() => {
    // Effect code
  }, []);
  
  // 5. Event handlers
  const handleEvent = () => {
    // Handler code
  };
  
  // 6. Render
  return (
    <View>
      <Text>Content</Text>
    </View>
  );
}

// 7. Styles
const styles = StyleSheet.create({
  // Styles
});
```

### Comments
- Use comments to explain "why", not "what"
- Document complex algorithms
- Add JSDoc for functions:
  ```javascript
  /**
   * Generates personalized tasks based on user profile
   * @param {UserProfile} profile - User's profile
   * @param {number} count - Number of tasks to generate
   * @returns {Array<Task>} Generated tasks
   */
  function generateTasks(profile, count) {
    // Implementation
  }
  ```

## 🧪 Testing Guidelines

### Manual Testing
Before submitting:
- [ ] Test on both iOS and Android
- [ ] Test all user flows
- [ ] Check edge cases
- [ ] Verify data persistence
- [ ] Test error handling

### What to Test
- New features work as expected
- Existing features still work
- No console errors
- Data saves/loads correctly
- UI renders properly

## 📤 Submitting Changes

### Pull Request Process

1. **Update your fork**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```

3. **Make changes**
   - Write clean code
   - Follow style guide
   - Add comments
   - Test thoroughly

4. **Commit changes**
   ```bash
   git add .
   git commit -m "Add: Brief description of changes"
   ```

   **Commit Message Format:**
   - `Add:` New feature
   - `Fix:` Bug fix
   - `Update:` Update existing feature
   - `Refactor:` Code refactoring
   - `Docs:` Documentation changes
   - `Style:` Formatting changes

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature
   ```

6. **Create Pull Request**
   - Go to GitHub and create PR
   - Fill in PR template
   - Link related issues
   - Request review

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement

## Related Issues
Closes #123

## Testing
- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] Manual testing completed
- [ ] No console errors

## Screenshots
(if applicable)

## Checklist
- [ ] Code follows style guide
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🎨 Adding Task Templates

### Template Structure

**For READ_QUIZ:**
```javascript
{
  title: "Clear, engaging title",
  content: "2-3 paragraph educational content. Keep it concise and valuable.",
  questions: [
    new Question(
      "Question text",
      ["Option A", "Option B", "Option C", "Option D"],
      correctAnswerIndex
    )
  ]
}
```

**For REFLECTION/BRAINSTORMING/ACTION_PLANNING:**
```javascript
{
  title: "Clear title",
  description: "What the task involves",
  prompt: "Specific instruction for user"
}
```

### Template Guidelines

1. **Educational Value**: Teach something useful in < 10 minutes
2. **Accuracy**: Ensure facts are correct
3. **Self-Contained**: No external resources needed
4. **Clear Instructions**: User knows exactly what to do
5. **Appropriate Difficulty**: Match category and audience

### Adding a Template

1. Open `src/services/TaskGenerator.js`
2. Find `TASK_TEMPLATES` constant
3. Navigate to appropriate category
4. Add your template:
   ```javascript
   [TaskType.READ_QUIZ]: [
     // Existing templates
     {
       title: "Your New Template",
       content: "Educational content...",
       questions: [
         new Question("Q1", ["A", "B", "C", "D"], 1)
       ]
     }
   ]
   ```
5. Test the new template
6. Update `TASK_TEMPLATES.md` documentation

## 🐛 Bug Report Guidelines

### Required Information

```markdown
**Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Screenshots**
If applicable

**Environment**
- Device: [e.g., iPhone 14 Pro]
- OS: [e.g., iOS 16.0]
- App Version: [e.g., 1.0.0]

**Additional Context**
Any other relevant information
```

## 💡 Feature Request Guidelines

### Required Information

```markdown
**Feature Description**
Clear description of the feature

**Problem it Solves**
What problem does this address?

**Proposed Solution**
How should this work?

**Alternatives Considered**
Other approaches you thought about

**Additional Context**
Mockups, examples, use cases
```

## 🔍 Code Review Process

### What Reviewers Look For

1. **Functionality**: Does it work as intended?
2. **Code Quality**: Is it clean and maintainable?
3. **Performance**: Any performance concerns?
4. **Security**: Any security issues?
5. **Documentation**: Are changes documented?
6. **Tests**: Is it properly tested?

### Responding to Reviews

- Be respectful and professional
- Explain your reasoning
- Be open to suggestions
- Make requested changes
- Ask questions if unclear

## 📚 Documentation Standards

### When to Update Documentation

- Adding new features
- Changing existing features
- Fixing significant bugs
- Adding new dependencies
- Changing architecture

### Documentation Files to Update

| Change Type | Files to Update |
|-------------|----------------|
| New feature | README.md, ARCHITECTURE.md |
| New screen | FLOWCHART.md, UX_EXPLANATION.md |
| New model | DATABASE_SCHEMA.md, ARCHITECTURE.md |
| New template | TASK_TEMPLATES.md |
| Setup changes | SETUP.md |

## 🚀 Release Process

### Version Numbers
We use Semantic Versioning (SemVer):
- **Major** (1.0.0): Breaking changes
- **Minor** (0.1.0): New features, backwards compatible
- **Patch** (0.0.1): Bug fixes

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version number bumped
- [ ] Git tag created
- [ ] Release notes written

## 🤝 Code of Conduct

### Our Standards

**Positive Behavior:**
- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy

**Unacceptable Behavior:**
- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information
- Other unprofessional conduct

### Enforcement

Violations may result in:
1. Warning
2. Temporary ban
3. Permanent ban

Report violations to project maintainers.

## 📞 Getting Help

### Resources

- **Documentation**: Read existing docs first
- **Issues**: Search existing issues
- **Discussions**: Ask questions in GitHub Discussions
- **Stack Overflow**: Tag with `react-native`

### Questions to Ask

Before asking:
1. Did I read the documentation?
2. Did I search existing issues?
3. Can I provide a minimal reproducible example?

## 🎓 Learning Resources

### React Native
- [Official Docs](https://reactnative.dev/)
- [React Native Express](http://www.reactnativeexpress.com/)
- [Awesome React Native](https://github.com/jondot/awesome-react-native)

### React Navigation
- [Official Docs](https://reactnavigation.org/)
- [Navigation Playground](https://reactnavigation.org/docs/getting-started)

### JavaScript
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)
- [ES6 Features](http://es6-features.org/)

## 🏆 Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Given credit for their work

Thank you for contributing to Unfreeze! Together, we can help people build better phone habits and convert wasted time into personal growth. 🚀

---

## Quick Links

- [Setup Guide](./SETUP.md)
- [Architecture](./ARCHITECTURE.md)
- [Task Templates](./TASK_TEMPLATES.md)
- [Code of Conduct](#code-of-conduct)
- [Report Bug](https://github.com/mjaganna-a11y/Dont-Scroll/issues/new?labels=bug)
- [Request Feature](https://github.com/mjaganna-a11y/Dont-Scroll/issues/new?labels=enhancement)

---

**Questions?** Open an issue or start a discussion on GitHub!
