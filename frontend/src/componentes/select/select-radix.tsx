import React from "react";
import * as Select from "@radix-ui/react-select";
import classnames from "classnames";
import "./styles.css";

interface SelectDemoProps {
	value: string | null;
	onValueChange: (value: string | null) => void;
  }

const SelectDemo:React.FC<SelectDemoProps> = ({ value, onValueChange }) => (
	<Select.Root value={value ?? ""} onValueChange={onValueChange}>

		<Select.Trigger className="SelectTrigger" aria-label="Food">
			<Select.Value placeholder="Selecione uma opção" />
			<Select.Icon className="SelectIcon">
			</Select.Icon>
		</Select.Trigger>

		<Select.Portal>
			<Select.Content className="SelectContent">

				<Select.ScrollUpButton className="SelectScrollButton">
					{/* <ChevronUpIcon /> */}
				</Select.ScrollUpButton>

				<Select.Viewport className="SelectViewport">

					<Select.Group>
						<SelectItem value="riscoCritico">Risco crítico</SelectItem>
						<SelectItem value="risco">Risco moderado</SelectItem>
						<SelectItem value="alerta">Alerta</SelectItem>
						<SelectItem value="semRisco">Sem risco</SelectItem>
					</Select.Group>

				</Select.Viewport>

				<Select.ScrollDownButton className="SelectScrollButton">
					{/* <ChevronDownIcon /> */}
				</Select.ScrollDownButton>
                
			</Select.Content>
		</Select.Portal>
	</Select.Root>
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
