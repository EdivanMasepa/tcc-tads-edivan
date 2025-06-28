import React from "react";
import * as Select from "@radix-ui/react-select";
import classnames from "classnames";
import "./styles.css";

interface OptionInterface {
	key:number;
  	label: string;
  	value: string;
};

interface SelectDemoPropsInterface {
  value: string | null;
  onValueChange: (value: string | null) => void;
  options: OptionInterface[];
};

const SelectDemo:React.FC<SelectDemoPropsInterface> = ({ value, onValueChange, options }) => (
	<div key='uniqueKey'>
		<Select.Root value={value ?? ""} onValueChange={onValueChange}>

			<Select.Trigger className="SelectTrigger" aria-label="Food">
				<Select.Value placeholder="Selecione uma opção" />
				<Select.Icon className="SelectIcon"/>
			</Select.Trigger>

			<Select.Portal>
				<Select.Content className="SelectContent">

					<Select.ScrollUpButton className="SelectScrollButton">
						{/* <ChevronUpIcon /> */}
					</Select.ScrollUpButton>

					<Select.Viewport className="SelectViewport">
						<Select.Group>
							{options.map((option) => (
								<SelectItem key={option.key} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</Select.Group>
					</Select.Viewport>

					<Select.ScrollDownButton className="SelectScrollButton">
						{/* <ChevronDownIcon /> */}
					</Select.ScrollDownButton>
					
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	</div>
);

const SelectItem = React.forwardRef<HTMLDivElement, Select.SelectItemProps>(
    ({ children, className, ...props }, forwardedRef) => {
      return (
        <Select.Item
          className={classnames("SelectItem", className)}
          {...props}
          ref={forwardedRef}
        >
          <Select.ItemText>{children}</Select.ItemText>
          <Select.ItemIndicator className="SelectItemIndicator">
            {/* <CheckIcon /> */}
          </Select.ItemIndicator>
        </Select.Item>
      );
    }
  );

export default SelectDemo;
