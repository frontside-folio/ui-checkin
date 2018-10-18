import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  username: () => faker.internet.userName(),
  id: "5314b409-01d8-4146-860b-369af9ac2208"
});
