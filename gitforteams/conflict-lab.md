# Conflict Lab

This file is used to practice resolving merge conflicts in Git.

The line below may be edited by two branches at the same time.
When that happens, Git cannot automatically decide which version should win, so you must resolve the conflict.

<!-- CONFLICT LINE — do not move this line -->
Our team's favorite programming language is: Python
<!-- END CONFLICT LINE -->

## What a conflict looks like

When two branches change the same line in different ways, Git marks the conflict like this:

```text
<<<<<<< HEAD
Our team's favorite programming language is: Python
=======
Our team's favorite programming language is: JavaScript
>>>>>>> other-branch
```

- `<<<<<<< HEAD` = the version from your current branch
- `=======` = the separator between both versions
- `>>>>>>> other-branch` = the version from the other branch

## How to fix it

1. Open the file and find the conflict markers: `<<<<<<<`, `=======`, and `>>>>>>>`.
2. Review both versions and decide which text should stay, or combine the best parts from each.
3. Remove the conflict markers and keep only the final version you want.
4. Save the file.
5. Stage the fix with `git add .`.
6. Commit your resolution with `git commit -m "Resolve conflict in conflict-lab.md"`.
7. Push your changes and add a short note in your pull request explaining what you kept and why.

This process helps you make a clear, intentional decision when Git cannot choose for you.
