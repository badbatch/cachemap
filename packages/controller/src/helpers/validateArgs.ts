import { isString } from "lodash";
import { EventData } from "..";

export default ({ name, type }: EventData) => (isString(name) && !!name.length) || (isString(type) && !!type.length);
