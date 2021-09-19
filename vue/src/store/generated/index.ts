// THIS FILE IS GENERATED AUTOMATICALLY. DO NOT MODIFY.

import CosmosCosmosSdkIbcCoreConnectionV1 from './cosmos/cosmos-sdk/ibc.core.connection.v1'
import CosmosCosmosSdkCosmosEvidenceV1Beta1 from './cosmos/cosmos-sdk/cosmos.evidence.v1beta1'
import CosmosCosmosSdkCosmosBaseV1Beta1 from './cosmos/cosmos-sdk/cosmos.base.v1beta1'
import CosmosCosmosSdkIbcCoreChannelV1 from './cosmos/cosmos-sdk/ibc.core.channel.v1'
import CosmosCosmosSdkCosmosDistributionV1Beta1 from './cosmos/cosmos-sdk/cosmos.distribution.v1beta1'
import CosmosCosmosSdkCosmosGovV1Beta1 from './cosmos/cosmos-sdk/cosmos.gov.v1beta1'
import CosmosCosmosSdkCosmosBankV1Beta1 from './cosmos/cosmos-sdk/cosmos.bank.v1beta1'
import CosmosCosmosSdkIbcApplicationsTransferV1 from './cosmos/cosmos-sdk/ibc.applications.transfer.v1'
import CosmosCosmosSdkCosmosSlashingV1Beta1 from './cosmos/cosmos-sdk/cosmos.slashing.v1beta1'
import CosmosCosmosSdkCosmosBaseAbciV1Beta1 from './cosmos/cosmos-sdk/cosmos.base.abci.v1beta1'
import CmwatersRookRookGame from './cmwaters/rook/rook.game'
import CosmosCosmosSdkCosmosCrisisV1Beta1 from './cosmos/cosmos-sdk/cosmos.crisis.v1beta1'
import CmwatersRookCmwatersRookRook from './cmwaters/rook/cmwaters.rook.rook'
import CosmosCosmosSdkCosmosVestingV1Beta1 from './cosmos/cosmos-sdk/cosmos.vesting.v1beta1'
import CosmosCosmosSdkIbcCoreClientV1 from './cosmos/cosmos-sdk/ibc.core.client.v1'
import CosmosCosmosSdkCosmosStakingV1Beta1 from './cosmos/cosmos-sdk/cosmos.staking.v1beta1'
import CmwatersRookRookMatchmaker from './cmwaters/rook/rook.matchmaker'


export default { 
  CosmosCosmosSdkIbcCoreConnectionV1: load(CosmosCosmosSdkIbcCoreConnectionV1, 'ibc.core.connection.v1'),
  CosmosCosmosSdkCosmosEvidenceV1Beta1: load(CosmosCosmosSdkCosmosEvidenceV1Beta1, 'cosmos.evidence.v1beta1'),
  CosmosCosmosSdkCosmosBaseV1Beta1: load(CosmosCosmosSdkCosmosBaseV1Beta1, 'cosmos.base.v1beta1'),
  CosmosCosmosSdkIbcCoreChannelV1: load(CosmosCosmosSdkIbcCoreChannelV1, 'ibc.core.channel.v1'),
  CosmosCosmosSdkCosmosDistributionV1Beta1: load(CosmosCosmosSdkCosmosDistributionV1Beta1, 'cosmos.distribution.v1beta1'),
  CosmosCosmosSdkCosmosGovV1Beta1: load(CosmosCosmosSdkCosmosGovV1Beta1, 'cosmos.gov.v1beta1'),
  CosmosCosmosSdkCosmosBankV1Beta1: load(CosmosCosmosSdkCosmosBankV1Beta1, 'cosmos.bank.v1beta1'),
  CosmosCosmosSdkIbcApplicationsTransferV1: load(CosmosCosmosSdkIbcApplicationsTransferV1, 'ibc.applications.transfer.v1'),
  CosmosCosmosSdkCosmosSlashingV1Beta1: load(CosmosCosmosSdkCosmosSlashingV1Beta1, 'cosmos.slashing.v1beta1'),
  CosmosCosmosSdkCosmosBaseAbciV1Beta1: load(CosmosCosmosSdkCosmosBaseAbciV1Beta1, 'cosmos.base.abci.v1beta1'),
  CmwatersRookRookGame: load(CmwatersRookRookGame, 'rook.game'),
  CosmosCosmosSdkCosmosCrisisV1Beta1: load(CosmosCosmosSdkCosmosCrisisV1Beta1, 'cosmos.crisis.v1beta1'),
  CmwatersRookCmwatersRookRook: load(CmwatersRookCmwatersRookRook, 'cmwaters.rook.rook'),
  CosmosCosmosSdkCosmosVestingV1Beta1: load(CosmosCosmosSdkCosmosVestingV1Beta1, 'cosmos.vesting.v1beta1'),
  CosmosCosmosSdkIbcCoreClientV1: load(CosmosCosmosSdkIbcCoreClientV1, 'ibc.core.client.v1'),
  CosmosCosmosSdkCosmosStakingV1Beta1: load(CosmosCosmosSdkCosmosStakingV1Beta1, 'cosmos.staking.v1beta1'),
  CmwatersRookRookMatchmaker: load(CmwatersRookRookMatchmaker, 'rook.matchmaker'),
  
}


function load(mod, fullns) {
    return function init(store) {        
        if (store.hasModule([fullns])) {
            throw new Error('Duplicate module name detected: '+ fullns)
        }else{
            store.registerModule([fullns], mod)
            store.subscribe((mutation) => {
                if (mutation.type == 'common/env/INITIALIZE_WS_COMPLETE') {
                    store.dispatch(fullns+ '/init', null, {
                        root: true
                    })
                }
            })
        }
    }
}
