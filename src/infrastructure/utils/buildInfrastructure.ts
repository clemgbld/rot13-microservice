import http from "http";
import { pipe } from "ramda";
import { withConstructor } from "../../utils/withConstructor";
import { DependancyHttp } from "../http-server";

interface InfrastructureObj {
  create: (request?: any) => any;
  createNull?: () => any;
}
interface BuildInfrastructure {
  dependancy: DependancyHttp | http.IncomingMessage;
  infrastructureObj: InfrastructureObj;
  withMixin: any;
}

export const buildInfrastructure = ({
  dependancy,
  infrastructureObj,
  withMixin,
}: BuildInfrastructure) =>
  pipe(withMixin(dependancy), withConstructor(infrastructureObj))({});
