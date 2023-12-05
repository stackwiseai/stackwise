import callOrcaModelAndGetResponse from '../stacks/callOrcaModelAndGetResponse';
test('callOrca2 correctly', async () => {
  await callOrcaModelAndGetResponse("Tell me some fun facts about orcas")
});
