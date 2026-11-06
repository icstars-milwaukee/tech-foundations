# Prompt Cookbook

**Name:** Luke & Desmond

A recipe is a prompt you can **reuse**: same structure, new ingredients. Write prompts you'll actually use for studying, writing, code, or your sprint project.

Every recipe needs all fields filled in. Keep private data out of the prompts and the sample results.

---

## Example recipe (already done, don't count this one)

- **Name:** Explain an error message
- **Goal:** Understand a confusing error before I try to fix it.
- **Prompt:**

```text
You are a patient JavaScript tutor for a beginner.
Explain the error message below in plain language.
Context: I'm running a Node.js script from the terminal. Here is the line
the error points to: <paste one line of code>
Format: 1) What it means in one sentence. 2) The two most common causes.
3) One thing I can check first.
Constraints: Don't rewrite my whole program. If you can't tell the cause
from what I gave you, say what else you need to see.

Error:
<paste the first line of the error>
```

- **Sample result (short):** "It means you tried to read a property of something that's undefined. Common causes: an array index past the end, or a typo in a property name. Check: log the value right before that line."
- **What I checked:** Added a `log.debug` before the line. The value was undefined, so the explanation was correct.
- **Risks to watch:** It may guess a cause that sounds right. The log proves it, the AI doesn't.
- **Peer test:** 

---

## Recipe 1

- **Name:** Why must the code be formated like this?
- **Goal:** To understand the code and why it works that way.
- **Prompt:**

```text
You are a javascript editor. Explain the code to me as if I'm someone who hasn't operated java script before. The code is running in a cloud serviced environment. Answer for me in bullets that are easy to read. Only use bullets, do not over explain.

Code: const randomHexColor = () => `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;
```

- **Sample result (short):** Explained what the numbers are and how the code uses those numbers and special characters to randomize a color.
- **What I checked:** What the sources of the AI were.
- **Risks to watch:**  The AI used pre-taught knowledge to answer our question.
- **Peer test:** Desmond also ran it through Chat GPT and got a similar result

## Recipe 2
- **Name:** How can I make my videos autoplay without being prompted to?
- **Goal:** To figure out a way to code this feature.
- **Prompt:**
```
Role:
You are a web developer.
 
Task:
Provide a solution that allows a video to autoplay on a web page.
 
Content:
I am building a website with HTML and want videos to begin playing automatically when the page loads.
 
Formula:
1. Explain how autoplay works.
2. Provide the HTML code.
3. Explain each important attribute used.
4. Mention any browser limitations.
 
Constraints:
- Use beginner-friendly language.
- Include a complete code example.
- Keep explanations concise.
- Explain why muted videos are often required for autoplay.
```
- **Sample result (short):** Provided HTML video code using autoplay, muted, and loop attributes, with a short explanation of how browsers handle autoplay.
- **What I checked:** Tested the code in a browser and verified that the autoplay feature worked when the video was muted.
- **Risks to watch:** Different browsers have autoplay restrictions and may block playback if the video includes sound.
- **Peer test:** A classmate tested the code on their computer and achieved similar results.

## Recipe 3
- **Name:** How do I center an element on my webpage?
- **Goal:** To learn how CSS positioning and layout tools work.
- **Prompt:**
```text
Role:
You are a front-end web development instructor.
 
Task:
Teach me how to center an element on a webpage.
 
Content:
I am building a website using HTML and CSS and want a button, image, or div to appear in the center of the page.
 
Formula:
1. Explain what it means to center an element.
2. Provide the HTML code.
3. Provide the CSS code.
4. Explain how the code works.
5. Mention alternative ways to center elements.
 
Constraints:
- Use beginner-friendly language.
- Include complete code examples.
- Keep explanations under 5 bullet points.
- Focus on modern CSS methods such as Flexbox.
```
- **Sample result (short):** Provided HTML and CSS using Flexbox to center a button both horizontally and vertically on the page.
- **What I checked:** Copied the code into a browser and confirmed the element appeared in the center of the screen.
- **Risks to watch:** Different layouts may require different centering methods depending on the parent container and screen size.
- **Peer test:** A classmate used the same code with an image instead of a button and achieved the same centered layout.