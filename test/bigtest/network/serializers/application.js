import { RestSerializer } from 'miragejs';
// import { RestSerializer as MirageRestSerializer } from 'miragejs';
// import { camelize, singularize, pluralize, underscore } from 'inflected';

export default RestSerializer;

/*

export default class RestSerializer extends MirageRestSerializer {
  keyForModel(type) {
    return camelize(underscore(type), false);
  }

  keyForAttribute(attr) {
    return camelize(underscore(attr), false);
  }

  keyForRelationship(type) {
    return camelize(underscore(pluralize(type)), false);
  }

  keyForEmbeddedRelationship(attributeName) {
    return camelize(underscore(attributeName), false);
  }

  keyForRelationshipIds(type) {
    return camelize(underscore(pluralize(type)), false);
  }

  keyForForeignKey(relationshipName) {
    return camelize(underscore(singularize(relationshipName)), false);
  }
}

*/

/*

{RestSerializer} here
  restserializer from bigtest/mirage is a class extended by another class
  restserializer from miragejs just extends instead of instantiating a new class
    refactoring by instantiating a new class from miragejs
      doesn't work but also don't think this is how i should approach it
      so i import and export just as is and fix the problem backwards?
{Response} in check-in.test

and in models branch, all the models modules

and also charles said we should never bring dependencies to the root of a monorepo? related to effection and bigtest

*/
