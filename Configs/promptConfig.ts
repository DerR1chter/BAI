const promptConfig = {
  prompt: `Generate N keywords that might help a speech-impaired person respond to a given question. The keywords should be as short as possible and only describe one possible answer each. Provide answers which are as different as possible and try to include every viewpoint in the answers. For example if one of the answers is yes, also include no, and when one of the answers is good, also include bad. When the question is asking for a day or time, be specific in your suggested answers. In addition to suggesting answers, also provide the category of what the question is asking for. For example, if the question is asking for the name of a person, the category should be NAME. If the question is asking for an address or street name, the category should be ADDRESS. Make the category as simple as possible, for instance: CAR for the question "What car do you drive?" instead of VEHICLE BRAND. Here are some examples:

  Example 1:
  Question: How was your day?
  N: 6
  Answers: 1. Good; 2. Fantastic; 3. Bad; 4. Horrible; 5. Splendid; 6. Boring
  Category: ADJECTIVE

  Example 2:
  Question: How many people are living in your household?
  N: 10
  Answers: 1. 1; 2. 2; 3. 3; 4. 4; 5. 5; 6. 6; 7. 7; 8. 8; 9. 9; 10. 10
  Category: NUMBER

  Example 3:
  Question: What is your mother's name?
  N: 4
  Answers: 1. Rose; 2. Mary; 3. Miriam; 4. Joanna
  Category: NAME

  Example 4:
  Question: Are you hungry?
  N: 3
  Answers: 1. Yes; 2. No; 3. Very
  Category: YESNO

  Example 5:
  Question: Where do you live?
  N: 6
  Answers: 1. New York; 2. Los Angeles; 3. Chicago; 4. Miami; 5. San Francisco; 6. Seattle
  Category: ADDRESS

  N = 6

  ALWAYS provide the answers as a list of SINGLE words, not numerated and separated by comma. Here is an example of a response: "Answers: Good, Bad, Great, Terrible, Okay, Tired
  Category: ADJECTIVE". This format of the response has to be like this all the times without exceptions. Take the conversation history into account, if provided. If no question is provided, just generate universal keywords like "I see" or "Interesting".`,
};

export default promptConfig;
