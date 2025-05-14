import { ReactNode } from "react";
import TableHeader from "./TableHeader";
import TitleWithSubtitle from "./TitleandSubtitle";

interface PanelProps {
  rightContent?: ReactNode;
  children?: ReactNode;
  title?: string;
  subtitle?: string;
}
const GenosPanel: React.FC<PanelProps> = ({
  rightContent,
  children,
  title = "",
  subtitle = "",
}) => {
  return (
    <div className="rounded-lg border overflow-hidden bg-white flex-1">
      <TableHeader
        leftContent={<TitleWithSubtitle title={title} subtitle={subtitle} />}
        rightContent={rightContent}
      />

      {/* Table */}
      <div className="overflow-x-auto ">{children}</div>
    </div>
  );
};

export default GenosPanel;
