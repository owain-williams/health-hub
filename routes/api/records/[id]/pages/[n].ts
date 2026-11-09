/** Read Page: one stored file of a Record the signed-in Person holds (docs/specs/records.md). */
import { defineHandler } from "void";
import { requirePerson } from "../../../../../src/application/identity/requirePerson";
import { recordsService } from "../../../../../src/application/records/live";
import { pageResponse } from "../../../../../src/http/records/pageResponse";

export const GET = defineHandler(async (c) => {
  const { person } = requirePerson(c);
  const n = Number(c.req.param("n"));
  return pageResponse(await recordsService.readPage(person.id, c.req.param("id") ?? "", n));
});
