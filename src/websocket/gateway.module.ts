import { Module } from "@nestjs/common";
import { AppGateway } from "./gateway";
import { GatewayService } from "./gateway.service";


@Module({
    imports: [],
    providers: [AppGateway, GatewayService],
})


export class GatewayModule {}