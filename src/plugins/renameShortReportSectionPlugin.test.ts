import Deferred from "../core/Deferred";
import renameShortReportSectionsPlugin from "./renameShortReportSectionsPlugin";

describe("renameShortReportSectionsPlugin", () => {
  it("appends sequential numbers to section names", async () => {
    const renamed = renameShortReportSectionsPlugin()(
      () =>
        new Deferred((r) =>
          r({
            type: "stub",
            id: "foo",
            shortReportSections: [
              {
                name: "foo",
                content: "test",
                show: true,
              },
              {
                name: "foo",
                content: "test test",
                show: true,
              },
              {
                name: "foo",
                content: "test test test",
                show: true,
              },
              {
                name: "unique",
                content: "test test test test",
                show: true,
              },
            ],
          })
        )
    )(null as any, null as any, null as any);
    expect(await renamed).toEqual({
      type: "stub",
      id: "foo",
      shortReportSections: [
        {
          name: "foo",
          content: "test",
          show: true,
        },
        {
          name: "foo_2",
          content: "test test",
          show: true,
        },
        {
          name: "foo_3",
          content: "test test test",
          show: true,
        },
        {
          name: "unique",
          content: "test test test test",
          show: true,
        },
      ],
    });
  });
});
