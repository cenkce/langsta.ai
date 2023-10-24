import { ReactNode, useState } from "react";
export type AccordionData = {
  id: string;
  title: string | ReactNode;
  content: string | ReactNode;
};

export const AccordionComponent = (props: {
  data: AccordionData[];
}) => {
  const [selected, selectedContent] = useState<string>("");
  return props.data.map((item) => {
    return (
      <div className="collapse collapse-plus bg-base-200" key={item.id}>
        <input
          type="radio"
          name="my-accordion-3"
          checked={selected === item.id}
          onChange={() => {
            selectedContent(item.id);
          }}
        />
        <div className="collapse-title text-xl font-medium">{item.title}</div>
        <div className="collapse-content">{item.content}</div>
        <footer></footer>
      </div>
    );
  });
};