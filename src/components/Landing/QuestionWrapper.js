import React, { useState } from "react";
import { Button } from "react-bootstrap";

export default function QuestionWrapper({ children }) {
  const [expandAll, setExpandAll] = useState(false);

  const childrenWithProps = React.Children.map(children, (child, index) => {
    return React.cloneElement(child, { open: expandAll });
  });

  return (
    <div>
      <Button
        className="mt-3"
        variant="link"
        onClick={() => setExpandAll((prevState) => !prevState)}
      >
        {expandAll ? "Collapse All" : "Expand All"}
      </Button>
      {childrenWithProps}
    </div>
  );
}
