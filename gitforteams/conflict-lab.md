# Conflict Lab

This file is used to practice resolving merge conflicts.

The line below will be edited by TWO branches at the same time.
That's what creates a conflict — Git can't decide which version wins, so YOU do.

<!-- CONFLICT LINE — do not move this line -->
Our team's favorite programming language is: TBD
<!-- END CONFLICT LINE -->

## What a conflict looks like
When two branches change the same line, Git marks it like this:

```
<<<<<<< HEAD
Our team's favorite programming language is: Python
=======
Our team's favorite programming language is: JavaScript
>>>>>>> other-branch
```

- `<<<<<<< HEAD` = your version
- `=======` = the divider
- `>>>>>>> other-branch` = their version

## How to fix it
1. Delete the `<<<<<<<`, `=======`, and `>>>>>>>` marker lines.
2. Keep the final text you want (maybe combine both).
3. Save the file.
4. `git add .` then `git commit -m "Resolve conflict in conflict-lab.md"`
5. Push. Add a resolution note in your PR comment explaining what you kept and why.
