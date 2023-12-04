import editVoiceSettings from ".";

test("Edit settings for a specific voice.", async () => {
  const method = "POST";
  const body = {
    similarity_boost: 123,
    stability: 123,
    style: 123,
    use_speaker_boost: true,
  };
  const voiceID = "21m00Tcm4TlvDq8ikWAM";
  const response = await editVoiceSettings(method, body, voiceID);

  expect(response).not.toBeNull();
  console.log(response);
});
