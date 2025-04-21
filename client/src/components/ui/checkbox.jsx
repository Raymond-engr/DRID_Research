// client/src/components/ui/checkbox.jsx
import * as React from "react";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef(
  ({ className, checked, defaultChecked, onCheckedChange