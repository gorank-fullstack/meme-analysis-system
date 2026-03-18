import { Injectable, Logger } from '@nestjs/common';
import { Redis as IoRedis } from 'ioredis';
import {
  getFullPath_3_Param_Fast, getFullPath_4_Param_Fast_All_Slash,
  getChainNameTab_And_qtType_Key, getCacheFullPath_All_Slash,
  // getFullPath_4_Param_Fast_Last_Underline,
} from 'src/utils/path';
// import } from 'src/utils-task/uniform-data/task-gr_path';
import { isNil } from '@nestjs/common/utils/shared.utils';
// import { Cron } from '@nestjs/schedule';
import { Cron, Interval, CronExpression } from '@nestjs/schedule';
import { TASK_CRON_EXPRESSION, TASK_INTERVAL_EXPRESSION } from 'src/constant/TASK_EXPRESSION';
import { API_PAGE_NEW_POOLS } from 'src/constant/API_PAGE';
import { ApiGrService } from 'src/api/uniform-data/api-gr/api-gr.service';
import { TChainName, TQtType, TTabType_Server } from "@gr/interface-base";
import { IGrTokenSortItem_Client, IGrTokenSortPageResult_Client, } from '@gr/interface-api/uniform-data';
import { CACHE_KEY_HEAD, CACHE_KEY_MIDDLE } from 'src/constant/CACHE_KEY';
import { getTaskGrToken_fromApi, merge_1_And_2 } from 'src/utils/task/uniform-data/task-gr_api';
import {
  // TTaskPageInfo,
  // getTaskPageInfo, 
  // getTempGrSortItemList, 
  // T_ChainTab_And_Duration_Key,
  T_ChainNameTab_And_qtType_Key_new,
  // TChainTabDurationKey, 
  IPageFields,
  INIT_EMPTY_ARRAY_GR_SORT_ITEM,
} from '@gr/interface-task/uniform-data';
import { TASK_PAGE_MAP_V2 } from 'src/utils/task/uniform-data/task-gr_dopage';
// import { DATA_CLIP } from 'src/constant/DATA_CLIP';
import { SortHotService } from 'src/sort/uniform-data/sort-hot/sort-hot.service';

// import { getFullPath_3_Param_Fast } from 'src/utils/path';
@Injectable()
export class TaskGrService {

  constructor(
    private apiGrService: ApiGrService,
    private readonly sortHotService: SortHotService,
    // Gpt:对于外部依赖（Redis、数据库、服务类等） → 使用构造函数注入 constructor(private readonly dep: Type)
    private readonly redisClient: IoRedis,
  ) {
  }

  private readonly logger = new Logger(TaskGrService.name);

  // private current_page_no: number = 1;
  private readonly task_Get_GrToken_On_ChainName_Status: Record<TChainName, boolean> = {
    // spl
    sol: true,
  
    // evm
    eth: true,
    bsc: true,
    base: false,
    aval: false,
    arb: false,
    linea: false,
    pulse: false,
    polygon: false,
    optimism: false,
    moonbeam: false,
    gnosis: false,
    ronin: false,
    fantom: false,
    cronos: false,
    lisk: false,
    chiliz: false,
    blast: false,
    sonic: false,
    hyper: false,
    sei: false,
    uni: false,
    "x-layer": false,
  
    // tvm
    tron: false,
  
    // fvm
    flow: false,
  
    // tao
    bittensor: false,
  
    // move
    sui: false,
    aptos: false,
  };
  
  /* 
  重要知识点一：
    这里的：private readonly是表示：不能将 pageDataMap 指向另一个对象，但它的内部字段内容是可以改的（浅只读）。
    而：ITaskPageInfo结构体的定义，限制了：current_page_trending、current_page_new是可改的属性；
    max_page_trending、max_page_new 是不可以改的属性

    不充许的操作：
    this.taskPageInfo = {}; // ❌ 错误，整个对象不可重赋值
   */
  /* 
  重要知识点二：非显式复制对象 vs 显式复制对象

  非显式复制对象
    const a = getTaskPageInfo("sol");  // 返回引用
    const b = a;                        // b 是 a 的引用
    b.current_page_new++;              // a.current_page_new 也被改变了 ❌

  显式复制对象
    const b = { ...a };                // b 是 a 的浅拷贝对象 ✅
   */

  /* private readonly taskPage_v2: Record<TChainKey, TTaskPageInfo> = {
    sol: { ...getTaskPageInfo("sol") },
    eth: { ...getTaskPageInfo("eth") },
    bsc: { ...getTaskPageInfo("bsc") },
  }; */
  private readonly taskPage_v2: Record<T_ChainNameTab_And_qtType_Key_new, IPageFields> = {
    ...TASK_PAGE_MAP_V2
  };

  /*  private readonly tempGrSortItemList: Record<TChainTabDurationKey, IGrTokenSortItem[]> = {
     sol: { ...getTempGrSortItemList("sol") },
     eth: { ...getTempGrSortItemList("eth") },
     bsc: { ...getTempGrSortItemList("bsc") },
   }; */

  /* 重要知识点三：{...对象} 和 [...数组] 的 区别
    { ...TEMP_GR_SORT_ITEM } 用于对象的 浅拷贝
    TEMP_GR_SORT_ITEM 是一个 对象（Record 类型）

    { ...obj } 是 JavaScript/TypeScript 中用于复制对象属性的语法（对象展开）

    -------------------------
    [ ...TEMP_GR_SORT_ITEM ] 用于数组的 浅拷贝
    [...] 是用来复制数组元素的

    但 TEMP_GR_SORT_ITEM 是个对象，不是数组 → 所以不能用中括号
   */

  //临时数组--不存入缓存。翻页完成后，会被清空
  private readonly tempGrSortItemList: Record<T_ChainNameTab_And_qtType_Key_new, IGrTokenSortItem_Client[]> = {
    ...INIT_EMPTY_ARRAY_GR_SORT_ITEM
  };

  //历史数组
  private readonly historyGrSortItemList: Record<T_ChainNameTab_And_qtType_Key_new, IGrTokenSortItem_Client[]> = {
    ...INIT_EMPTY_ARRAY_GR_SORT_ITEM
  };

  // toPage(chainType: string) {
  toPage(chainTab_And_Duration_Key: T_ChainNameTab_And_qtType_Key_new) {
    /*需要注意的是：test1.ts 和 test2.ts 中通过 getTaskPageInfo(chainType) 得到的是同一个对象的引用（共享内存），
      因此它们操作的是同一份数据，结果会互相影响、混在一起。*/
    if (this.taskPage_v2[chainTab_And_Duration_Key].current_page > this.taskPage_v2[chainTab_And_Duration_Key].max_page) {
      this.taskPage_v2[chainTab_And_Duration_Key].current_page = this.taskPage_v2[chainTab_And_Duration_Key].max_page + 1;
    } else {
      this.taskPage_v2[chainTab_And_Duration_Key].current_page++;
    }
  }

  /*   @Cron(TASK_EXPRESSION.EVERY_MINUTE)    //每1分
    doGetGrTokenSortItem(); */
  /* Gpt:
  @Cron() 装饰器需要作用于一个无参数的方法，NestJS 框架会在指定时间自动调用这个方法。
   */
  /* @Cron(TASK_EXPRESSION.EVERY_MINUTE)    //每1分
  doGetGrTokenSortItem_sol_trending_pools_1h() {
    this.getGrTokenSortItem(
      "sol",
      CACHE_KEY_MIDDLE.TRENDING_POOLS as TTabType,
      "1h");
  } */


  @Interval(TASK_INTERVAL_EXPRESSION.EVERY_50_SECOND)
  doGetGrTokenSortItem_sol_trending_pools_5m() {
    const chainName: TChainName = "sol";
    // const chainType: TChainType = "eth";
    const tabType: TTabType_Server = CACHE_KEY_MIDDLE.TRENDING_POOLS as TTabType_Server;
    const qtType: TQtType = "5m";

    if (this.task_Get_GrToken_On_ChainName_Status[chainName] === true) {
      console.log(new Date(), `--${chainName} ${qtType}--`, TASK_INTERVAL_EXPRESSION.EVERY_50_SECOND);
      // console.log(new Date(), `--${chainType} ${qtType}--`, TASK_INTERVAL_EXPRESSION.EVERY_120_SECOND);
      this.getGrTokenSortItem_v2(chainName, tabType, qtType);
    } else {
      console.log(new Date(), `--${chainName} ${qtType}--task_Get_GrToken_On_ChainType_Status[${chainName}]=false`);
    }
  }

  @Interval(TASK_INTERVAL_EXPRESSION.EVERY_120_SECOND)
  doGetGrTokenSortItem_bsc_trending_pools_5m() {    
    const chainName: TChainName = "bsc";
    const tabType: TTabType_Server = CACHE_KEY_MIDDLE.TRENDING_POOLS as TTabType_Server;
    const qtType: TQtType = "5m";

    if (this.task_Get_GrToken_On_ChainName_Status[chainName] === true) {
      console.log(new Date(), `--${chainName} ${qtType}--`, TASK_INTERVAL_EXPRESSION.EVERY_120_SECOND);
      this.getGrTokenSortItem_v2(chainName, tabType, qtType);
    } else {
      console.log(new Date(), `--${chainName} ${qtType}--task_Get_GrToken_On_ChainType_Status[${chainName}]=false`);
    }
  }


  @Interval(TASK_INTERVAL_EXPRESSION.EVERY_260_SECOND)
  doGetGrTokenSortItem_eth_trending_pools_5m() {
    const chainName: TChainName = "eth";
    const tabType: TTabType_Server = CACHE_KEY_MIDDLE.TRENDING_POOLS as TTabType_Server;
    const qtType: TQtType = "5m";

    if (this.task_Get_GrToken_On_ChainName_Status[chainName] === true) {
      console.log(new Date(), `--${chainName} ${qtType}--`, TASK_INTERVAL_EXPRESSION.EVERY_260_SECOND);
      this.getGrTokenSortItem_v2(chainName, tabType, qtType);
    } else {
      console.log(new Date(), `--${chainName} ${qtType}--task_Get_GrToken_On_ChainType_Status[${chainName}]=false`);
    }
  }

  /* 重要知识点四：在 JavaScript（和 TypeScript）中，数组是引用类型
        示例：
          const a = [1, 2, 3];
          const b = a;
          b.push(4); // 现在 a 和 b 都变成 [1,2,3,4]
    
        所以这句：this.tempGrSortItemList[chainTabDurationKey] = lastGrTokenSortItem;
        意味着：
          this.tempGrSortItemList[chainTabDurationKey] 和 lastGrTokenSortItem 会指向同一个数组内存地址
          后续修改 lastGrTokenSortItem（如 push/pop）也会影响 this.tempGrSortItemList[...] 中的内容，反之亦然
    
        如果你想复制元素（避免引用共享），可以这样：
          this.tempGrSortItemList[chainTabDurationKey] = [...lastGrTokenSortItem];
    
        而，这句代码：this.tempGrSortItemList[chainTabDurationKey]= [];
        已经是创建了一个新的空数组引用，不需要再写成：this.tempGrSortItemList[chainTabDurationKey] = [...];        
        新示例：
          const a = [1, 2, 3];
          let b = a;     // b 和 a 共享引用
          b = [];        // b 现在指向新数组，a 不受影响
    
          console.log(a); // [1, 2, 3]
          console.log(b); // []
    */
  getGrTokenSortItem_v2 = async (
    chainName: TChainName,
    tabType: TTabType_Server,
    qtType: TQtType,
  ) => {
    /* const cacheKeyHead = CACHE_KEY_HEAD.CORN_TASK_GR; //要存入的是core永不过期缓存
    const cacheFullPath: string = getCacheFullPath_All_Slash(cacheKeyHead, chainType, tabType, duration);
    let payload: string = ""; */

    const chainNameTab_And_qtType_Key: T_ChainNameTab_And_qtType_Key_new = getChainNameTab_And_qtType_Key(chainName, tabType, qtType);

    const pageStr = String(this.taskPage_v2[chainNameTab_And_qtType_Key].current_page);

    this.logger.debug(`${this.taskPage_v2[chainNameTab_And_qtType_Key].current_page}--Called when the current minute is 45`);
    //调用
    let lastGrTokenSortItem: IGrTokenSortItem_Client[] = await getTaskGrToken_fromApi(
      chainName,
      tabType,
      pageStr,
      qtType,
      this.apiGrService,
      // this.redisClient,
    );

    //从api获取的结果更新到：sortHotService
    this.sortHotService.updateGrTokenSortItems(chainName, lastGrTokenSortItem);
    
    //执行翻页
    this.toPage(chainNameTab_And_qtType_Key);
  }

  getTrendingPools_v2 = async (
    chainName: TChainName,
    duration: TQtType,
    pageStr: string,
    // ): Promise<IGrTokenSortItem_Client[]> => {
  ): Promise<IGrTokenSortPageResult_Client> => {
    // let grTokenSortItem_Trending_Pools: IGrTokenSortItem_Client[] = [];
    // 重要知识点一：
    /* 
    不严格的写法：
    在 TypeScript 中，只要一个对象包含了你需要的结构（字段），就可以赋值给该类型变量，即使它还包含额外字段。
    所以这里：getChainQtHotGrTokenSortList返回：IGrTokenSortItem_Server[]，
    而：getTrendingPools_v2要求：返回：IGrTokenSortItem_Client[]，是不会报错的

    注意：这是单向兼容
    const serverList: IGrTokenSortItem_Server[] = clientList; // ❌ 错误：Client 可能缺少 `hot` 字段
     */
    // return this.sortHotService.getChainQtHotGrTokenSortList(chainType, duration);/* .forEach(grTokenSortItem => {}) */

    // 让类型更严格 —— 返回时：去除 hot 字段
    // const grTokenSortPageResult_Server: IGrTokenSortPageResult_Server = await this.sortHotService.getChainQtHotGrTokenSortList(chainType, duration,pageStr) as IGrTokenSortPageResult_Server
    // const grTokenSortItem_Client: IGrTokenSortItem_Client[] = [];
    /* return this.sortHotService.getChainQtHotGrTokenSortList(chainType, duration,pageStr).map(item => {
      const { hot, ...clientFields } = item;
      return clientFields;
    }); */
    /* 
    // 旧的:函数返回类型,只需要:list(IGrTokenSortItem_Client[]类型)
    const { list } = this.sortHotService.getChainQtHotGrTokenSortList(
      chainType,
      duration,
      pageStr
    ); */
    // 新的:函数返回类型,需要:maxPage(number类型), list(IGrTokenSortItem_Client[]类型)
    const { maxPage, list } = this.sortHotService.getChainQtHotGrTokenSortList(
      chainName,
      duration,
      pageStr,
    );

    const clientList: IGrTokenSortItem_Client[] = list.map(({ hot, ...clientFields }) => clientFields);

    // const result = list.map(({ hot, ...clientFields }) => clientFields);
    // 希望返回一个 Promise，可以用 Promise.resolve(...) 包装
    // return Promise.resolve(result);
    return {
      maxPage,
      list: clientList,
    };
    // return list.map(({ hot, ...clientFields }) => clientFields);
    // return grTokenSortItem_Trending_Pools;
  }

  /* getTrendingPools_v1_old_del = async (
    chainType: string,
    duration: string,

  ): Promise<IGrTokenSortItem_Client[]> => {
    const cacheKeyHead = CACHE_KEY_HEAD.CORN_TASK_GR; //读取的是由：corn定时生成的(永不过期)缓存
    const cacheKeyMiddle: TTabType_Server = CACHE_KEY_MIDDLE.TRENDING_POOLS as TTabType_Server;
    // const cacheFullPath_Trending_Pools: string = getFullPath_4_Param_Fast(cacheKeyHead, chainType, cacheKeyMiddle, duration);    
    const cacheFullPath_Trending_Pools: string = getFullPath_4_Param_Fast_All_Slash(cacheKeyHead, chainType, cacheKeyMiddle, duration);

    const chainTab_And_Duration_Key: T_ChainTab_And_Duration_Key_new = getChainTab_And_Duration_Key(chainType, cacheKeyMiddle, duration);

    let grTokenSortItem_Trending_Pools: IGrTokenSortItem_Client[] = [];
    //读入缓存
    try {
      const cached_Trending_Pools = await this.redisClient.get(cacheFullPath_Trending_Pools);

      if (!isNil(cached_Trending_Pools)) {
        grTokenSortItem_Trending_Pools = JSON.parse(cached_Trending_Pools);
      }
    } catch (error) {
      console.error(`Error reading Redis for getTrendingPools chainType=${chainType}`, error);
    }

    // ✅ 裁剪数据：最多返回前 max_records 条    
    if (grTokenSortItem_Trending_Pools.length > DATA_CLIP[chainTab_And_Duration_Key].max_records) {
      grTokenSortItem_Trending_Pools = grTokenSortItem_Trending_Pools.slice(0, DATA_CLIP[chainTab_And_Duration_Key].max_records);
    }

    return grTokenSortItem_Trending_Pools;
  } */

  getNewPools_v1_old_del = async (
    chainType: string,
  ): Promise<IGrTokenSortItem_Client[]> => {

    const cacheKeyHead = CACHE_KEY_HEAD.SJ_CORN_TASK_GR; //读取的是由：corn定时生成的(永不过期)缓存
    const cacheKeyMiddle: TTabType_Server = CACHE_KEY_MIDDLE.NEW_POOLS as TTabType_Server;
    const cacheFullPath_New_Pools = getFullPath_3_Param_Fast(cacheKeyHead, chainType, cacheKeyMiddle);
    const chainTab_And_Duration_Key: T_ChainNameTab_And_qtType_Key_new = getChainNameTab_And_qtType_Key(chainType, cacheKeyMiddle, "");

    let grTokenSortItem_New_Pools: IGrTokenSortItem_Client[] = [];
    //读入缓存
    try {
      const cached_New_Pools = await this.redisClient.get(cacheFullPath_New_Pools);

      if (!isNil(cached_New_Pools)) {
        grTokenSortItem_New_Pools = JSON.parse(cached_New_Pools);
      }
    } catch (error) {
      console.error(`Error reading Redis for getNewPools chainType=${chainType}`, error);
    }

    // ✅ 裁剪数据：最多返回前 max_records 条    
    // if (grTokenSortItem_New_Pools.length > DATA_CLIP[chainTab_And_Duration_Key].max_records) {
    //   grTokenSortItem_New_Pools = grTokenSortItem_New_Pools.slice(0, DATA_CLIP[chainTab_And_Duration_Key].max_records);
    // }

    return grTokenSortItem_New_Pools;
  }

}



