import { pipe } from "ramda";
import { withConstructor } from "../../utils/withConstructor";
import { DependancyHttp } from "../http-server";
import { DependancyHttpRequest } from "../http-request";

interface InfrastructureObj {
  create: (request?: any) => any;
  createNull?: (request?: any) => any;
}
interface BuildInfrastructure {
  dependancy: DependancyHttp | DependancyHttpRequest;
  infrastructureObj: InfrastructureObj;
  withMixin: any;
}

export const buildInfrastructure = ({
  dependancy,
  infrastructureObj,
  withMixin,
}: BuildInfrastructure) =>
  pipe(withMixin(dependancy), withConstructor(infrastructureObj))({});
