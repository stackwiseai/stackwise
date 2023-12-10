import createComponent from '.';

test('number input string output', () => {
  const ioData = {
    input: { num1: 'number', num2: 'number' },
    output: { result: 'string' },
  };
  const expectedInput = `<input type="number" name="num1" placeholder="Enter num1" required />
<input type="number" name="num2" placeholder="Enter num2" required />`;
  const expectedOutput = '<p>{value}</p>';

  const { inputContent, outputContent } = createComponent(ioData);
  expect(inputContent).toEqual(expectedInput);
  expect(outputContent).toEqual(expectedOutput);
});

test('string input number output', () => {
  const ioData = { input: { num: 'string' }, output: { length: 'number' } };

  const expectedInput = `<input type="text" name="num" placeholder="Enter num" required />`;
  const expectedOutput = `<div>{value}</div>`;

  const { inputContent, outputContent } = createComponent(ioData);
  expect(inputContent).toEqual(expectedInput);
  expect(outputContent).toEqual(expectedOutput);
});

test('boolean input string array multiple output', () => {
  const ioData = {
    input: { isTrue: 'boolean' },
    output: { chars: 'string[]', transformedString: 'boolean' },
  };

  const expectedInput = `<label htmlFor="isTrue">Is True</label>
<input type="checkbox" name="isTrue" required />`;
  const expectedOutput = `<div>{value.chars.map((item, i) => <p key={i}>{item}</p>)}</div>
<label htmlFor="transformedString">Transformed String</label>
<input type="checkbox" name="transformedString" checked={value.transformedString} readonly />`;

  const { inputContent, outputContent } = createComponent(ioData);
  expect(inputContent).toEqual(expectedInput);
  expect(outputContent).toEqual(expectedOutput);
});

test('no input video output', () => {
  const ioData = { input: 'null', output: { videoOut: 'video' } };

  const expectedInput = `No input for this stack`;
  const expectedOutput = `<video src={value} controls></video>`;

  const { inputContent, outputContent } = createComponent(ioData);
  expect(inputContent).toEqual(expectedInput);
  expect(outputContent).toEqual(expectedOutput);
});

test('image input and output', () => {
  const ioData = {
    input: { originalImage: 'image' },
    output: { image: 'image' },
  };

  const expectedInput = `<label htmlFor="originalImage">Original Image</label>
<input type="file" name="originalImage" accept="image/*" required />`;
  const expectedOutput = `<img src={value} alt="Image" />`;

  const { inputContent, outputContent } = createComponent(ioData);
  expect(inputContent).toEqual(expectedInput);
  expect(outputContent).toEqual(expectedOutput);
});

test('audio input and null output', () => {
  const ioData = {
    input: { originalAudio: 'audio' },
    output: 'null',
  };

  const expectedInput = `<label htmlFor="originalAudio">Original Audio</label>
<input type="file" name="originalAudio" accept="audio/*" required />`;
  const expectedOutput = `No output for this stack`;

  const { inputContent, outputContent } = createComponent(ioData);
  expect(inputContent).toEqual(expectedInput);
  expect(outputContent).toEqual(expectedOutput);
});

test('video input ', () => {
  const ioData = {
    input: { originalVideo: 'video' },
    output: { newVideo: 'audio' },
  };

  const expectedInput = `<label htmlFor="originalVideo">Original Video</label>
<input type="file" name="originalVideo" accept="video/*" required />`;
  const expectedOutput = `<audio src={value} controls></audio>`;

  const { inputContent, outputContent } = createComponent(ioData);
  expect(inputContent).toEqual(expectedInput);
  expect(outputContent).toEqual(expectedOutput);
});

test('complex form input with text and file output', () => {
  const ioData = {
    input: {
      reportDate: 'date',
      comments: 'string',
      priority: ['High', 'Medium', 'Low'],
    },
    output: { summary: 'string', reportFile: 'file' },
  };

  const expectedInput = `<label htmlFor="reportDate">Date</label>
<input type="date" name="reportDate" required />
<input type="text" name="comments" placeholder="Enter comments" required />
<label htmlFor="priority">Priority</label>
<select name="priority" required>
  <option value="High">High</option>
  <option value="Medium">Medium</option>
  <option value="Low">Low</option>
</select>`;
  const expectedOutput = `<p>{value.summary}</p>
<a href={value.reportFile} download>Report File</a>`;

  const { inputContent, outputContent } = createComponent(ioData);
  expect(inputContent).toEqual(expectedInput);
  expect(outputContent).toEqual(expectedOutput);
});

test('user profile edit form with text and image output', () => {
  const ioData = {
    input: {
      username: 'string',
      email: 'email',
      password: 'password',
      profilePicture: 'image',
      bio: 'string',
    },
    output: { confirmation: 'string', picturePreview: 'image' },
  };

  const expectedInput = `<input type="text" name="username" placeholder="Enter username" required />
<input type="email" name="email" placeholder="Enter email" required />
<input type="password" name="password" placeholder="Enter password" required />
<label htmlFor="profilePicture">Profile Picture</label>
<input type="file" name="profilePicture" accept="image/*" required />
<input type="text" name="bio" placeholder="Enter bio" required />`;
  const expectedOutput = `<p>{value.confirmation}</p>
<img src={value.picturePreview} alt="Picture Preview" />`;

  const { inputContent, outputContent } = createComponent(ioData);
  expect(inputContent).toEqual(expectedInput);
  expect(outputContent).toEqual(expectedOutput);
});
