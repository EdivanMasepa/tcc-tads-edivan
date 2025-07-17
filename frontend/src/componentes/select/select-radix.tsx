import React from "react";
import * as Select from "@radix-ui/react-select";
import classnames from "classnames";
import "./styles.css";
import { IoIosArrowDown } from "react-icons/io";

interface OptionInterface {
	key:number;
  	label: string;
  	value: string;
};

interface SelectDemoPropsInterface {
  value: string | null;
  onValueChange: (value: string | null) => void;
  options: OptionInterface[];
  classNameTrigger?: string;
};

const SelectDemo:React.FC<SelectDemoPropsInterface> = ({ value, onValueChange, options, classNameTrigger }) =>  {
	return (
		<Select.Root value={value ?? ""} onValueChange={onValueChange}>

			<Select.Trigger className={classnames("SelectTrigger", classNameTrigger)} aria-label="Select">
				<Select.Value className="SelectTriggerValue" placeholder="Selecione uma opção" />
				<Select.Icon className="SelectTriggerIcon"><IoIosArrowDown className="iconeArrowSelect"/></Select.Icon>
			</Select.Trigger>

			<Select.Portal>
				<Select.Content className="SelectContent">

					<Select.Viewport className="SelectViewport">
						<Select.Group className="SelectGroup">
							{options.map((option) => (
								<SelectItem className="SelectItem" key={option.key} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</Select.Group>
					</Select.Viewport>
					
				</Select.Content>
			</Select.Portal>
		</Select.Root>
);

}
const SelectItem = React.forwardRef<HTMLDivElement, Select.SelectItemProps>(
    ({ children, className, ...props }, forwardedRef) => {
      return (
        <Select.Item
          className={classnames("SelectItem", className)}
          {...props}
          ref={forwardedRef}
        >
          <Select.ItemText> {children} </Select.ItemText>
          <Select.ItemIndicator className="SelectItemIndicator">
            {/* <CheckIcon /> */}
          </Select.ItemIndicator>
        </Select.Item>
      );
    }
  );

export default SelectDemo;
