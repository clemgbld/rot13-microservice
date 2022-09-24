import { pipe } from "ramda";
import { withConstructor } from "../../utils/withConstructor";

interface InfrastructureObj {
  create: (request?: any) => any;
  createNull?: (request?: any) => any;
}
interface BuildInfrastructure {
  dependancy: any;
  infrastructureObj: InfrastructureObj;
  withMixin: any;
}

export const buildInfrastructure = ({
  dependancy,
  infrastructureObj,
  withMixin,
}: BuildInfrastructure) =>
  pipe(withMixin(dependancy), withConstructor(infrastructureObj))({});
