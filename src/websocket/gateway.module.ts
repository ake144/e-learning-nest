import { Module } from "@nestjs/common";
import { AppGateway } from "./gateway";


@Module({
    imports: [],
    providers: [AppGateway],
})


export class GatewayModule {}