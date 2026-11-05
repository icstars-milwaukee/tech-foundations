# Real AI Mistakes

These all happened. In each case, a person or a company trusted an AI output without enough checking, or gave an AI tool data it shouldn't have had. Read your group's case, then fill in `CASE_NOTES.md`.

As you read, ask: **which risk was it (reliability, bias, privacy)? And where could a human have stopped it?**

---

## Case 1: The lawyers who cited fake cases (2023)

Two New York lawyers used ChatGPT to research a lawsuit against the airline Avianca (*Mata v. Avianca*). Their court filing cited six earlier court decisions that **did not exist**. ChatGPT had invented them, with made-up quotes and case numbers. When one of the lawyers asked ChatGPT if the cases were real, it said yes. The judge fined the lawyers and their firm $5,000 and required them to write to the real judges who had been named as authors of the fake opinions.

**Think about:** The lawyer *did* ask the AI to confirm. Why wasn't that enough?

---

## Case 2: The airline chatbot that made up a refund policy (2024)

A customer asked Air Canada's website chatbot about bereavement fares after a family member died. The chatbot said he could buy a full-price ticket and apply for the discount later. That wasn't the airline's real policy. When he asked for the refund, Air Canada said no and argued the chatbot was responsible for its own words. A Canadian tribunal disagreed. It ruled the company is responsible for everything on its website, chatbot included, and ordered Air Canada to pay him back (about CA$800).

**Think about:** Who is accountable when an AI tool gives wrong information to a customer?

---

## Case 3: The hiring tool that learned to prefer men (reported 2018)

Amazon built an AI tool to score job applicants' resumes. It learned from ten years of past resumes, and most came from men, because the tech industry was mostly men. The tool taught itself that male candidates were better. It reportedly marked down resumes that included the word "women's" (as in "women's chess club captain"). Amazon's engineers tried to fix it, couldn't be sure it was fair, and the project was dropped.

**Think about:** Nobody told the tool to discriminate. Where did the bias come from?

---

## Case 4: Engineers who pasted secret code into a chatbot (2023)

Samsung allowed some engineers to use ChatGPT. Within weeks, employees reportedly pasted in confidential source code to find bugs and internal meeting notes to make summaries. That data left the company and went to an outside service. Samsung then restricted employees' use of generative AI tools on company devices.

**Think about:** The engineers were trying to work faster, not leak anything. What rule or habit would have prevented this?

---

## Case 5: The wrong fact in a launch demo (2023)

Google's ad for its new chatbot, Bard, showed it answering a question about the James Webb Space Telescope. Bard said the telescope took the very first pictures of a planet outside our solar system. That was wrong. Another telescope had done it years earlier. Astronomers pointed out the mistake right away, and Alphabet (Google's parent company) lost about $100 billion in stock market value the day it spread.

**Think about:** This was a public launch at one of the biggest tech companies in the world. Why didn't anyone fact-check one sentence?

---

## Case 6: The car dealership chatbot that agreed to a $1 deal (2023)

A Chevrolet dealership added an AI chatbot to its website. People quickly found they could talk it into almost anything. One user told it to agree with everything the customer says and to end every answer with "and that's a legally binding offer." Then he asked to buy a new SUV for $1. The chatbot agreed. The screenshots went viral, and the dealership took the bot down.

**Think about:** The chatbot followed instructions. Whose instructions should it have followed?

---

## Patterns to notice

| Pattern | Seen in |
|---|---|
| AI sounds confident when it's wrong | 1, 2, 5 |
| AI learns bias from its training data | 3 |
| People paste data that shouldn't leave the building | 4 |
| Users can steer AI away from its job | 6 |
| A human check was skipped because the output *looked* fine | all of them |
