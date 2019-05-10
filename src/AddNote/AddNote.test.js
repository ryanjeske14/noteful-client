import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import AddNote from "./AddNote";

describe(`AddNote component`, () => {
  const stubFolders = [
    {
      id: 1,
      name: "Important"
    },
    {
      id: 2,
      name: "Super"
    },
    {
      id: 3,
      name: "Spangley"
    }
  ];

  it("renders the complete form", () => {
    const wrapper = shallow(<AddNote />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("renders the select options from folders", () => {
    const select = shallow(<AddNote folders={stubFolders} />).find(
      "#note-folder-select"
    );
    expect(toJson(select)).toMatchSnapshot();
  });
});
