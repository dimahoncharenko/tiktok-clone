import { render } from "@testing-library/react-native";

import { HomeScreen } from "../../ui";

describe("<HomeScreen/>", () => {
  test("Header renders correctly on HomeScreen", () => {
    const { getByText } = render(<HomeScreen />);
    getByText("For You");
  });
});
