import parseCsv from "./parseCsv";

describe("parseCsv()", () => {
  it("can parse a basic csv with LF line endings", () => {
    const actual = parseCsv("title,color\n" + "Test,#fff");
    const expected = [
      ["title", "color"],
      ["Test", "#fff"],
    ];
    expect(actual).toEqual(expected);
  });
  it("can parse a basic csv with CRLF line endings", () => {
    const actual = parseCsv("title,color\r\n" + "Test,#fff");
    const expected = [
      ["title", "color"],
      ["Test", "#fff"],
    ];
    expect(actual).toEqual(expected);
  });
  it("can parse a basic csv with CR line endings", () => {
    const actual = parseCsv("title,color\r" + "Test,#fff");
    const expected = [
      ["title", "color"],
      ["Test", "#fff"],
    ];
    expect(actual).toEqual(expected);
  });
  it("can parse a csv with only one column", () => {
    const actual = parseCsv("color\n" + "#fff");
    const expected = [["color"], ["#fff"]];
    expect(actual).toEqual(expected);
  });
  it("can parse cells with comma", () => {
    const actual = parseCsv("title,color\n" + 'Test,"rgb(255,255,255)"');
    const expected = [
      ["title", "color"],
      ["Test", "rgb(255,255,255)"],
    ];
    expect(actual).toEqual(expected);
  });
  it("can parse cells with quotes", () => {
    const actual = parseCsv("title,color\n" + '"Literal quote ("")",#fff');
    const expected = [
      ["title", "color"],
      ['Literal quote (")', "#fff"],
    ];
    expect(actual).toEqual(expected);
  });
  it("can parse leading empty cells", () => {
    const actual = parseCsv("title1,title2,title3\n" + ",,foo");
    const expected = [
      ["title1", "title2", "title3"],
      ["", "", "foo"],
    ];
    expect(actual).toEqual(expected);
  });
  it("can parse trailing empty cells", () => {
    const actual = parseCsv("title1,title2,title3\n" + "foo,,");
    const expected = [
      ["title1", "title2", "title3"],
      ["foo", "", ""],
    ];
    expect(actual).toEqual(expected);
  });
});
