import { NextRequest, NextResponse } from "next/server";
import { solLowDb } from "@/myLowdb";
import { isAccessType } from "@/utils/normal";
//import { TABLE_NAMES } from "@/config/web3_constants";
import { TABLE_NAMES, LIMIT_TABLE_NAME } from "@/config/web3_constants";
interface IParams {
    params: Promise<{
        table: string,
    }>
}
// const accessTypes: string[] = ["token", "kline", "trx"];

//分页查询--多条数据(注意：此方法查询，不能指定查询字段，只能全文匹配querystr．)
//GET -- /api1/sol/token
export async function GET(request: NextRequest, { params }: IParams) {
    const { table: p_table } = await params;
    if (!isAccessType(TABLE_NAMES, p_table)) {
        return NextResponse.json({
            code: 400,
            message: "无效的 table",
            table: `无效的 table--${p_table}`,
            data: "",
            //data
        })
    }

    //获取参数
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
    const pagenum = Number(searchParams.get("pagenum")) || 1;
    const pagesize = Number(searchParams.get("pagesize")) || 2;

    const data = solLowDb[p_table as LIMIT_TABLE_NAME]?.data.posts;

    if (data === undefined) {
        // 安全地访问 data
        return NextResponse.json({
            code: 400,
            message: "无效的 data",
            data: "",
            //data
        })
    }
    //根据前端传过来的：query　获取所有符合条件的结果
    let filterData = query ?
        //有query，返回查找结果
        data.filter((item) => {
            //filter的作用是，遍历后，保存【条件符合】（即：return　结果为 true）的
            //rest 获得 id 以外的值
            //下行的注释，是为了忽略：build时，报错： Error: 'id' is assigned a value but never used.  @typescript-eslint/no-unused-vars
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...rest } = item

            return Object.values(rest).some(
                //不区分大小写查询
                (value) => String(value).toLowerCase().includes(query.toLowerCase()));
        })
        :
        //无query，返回所有数据
        data;

    //存放总记录数
    const total = filterData!.length;

    const startIndex = (pagenum - 1) * pagesize;
    let endIndex = pagenum * pagesize;   //实际等于：startIndex+pagesize

    //防止最后一页，溢出(即防止：endIndex>total）
    //如果最后一页的endIndex，超过total，则取值：total
    endIndex = Math.min(endIndex, total);
    //const endIndex = startIndex + pagesize>total?total:startIndex + pagesize>total;

    //截止，需要返回的记录【同时防止前端传过来的 startIndex ，超过总记录数】
    filterData = startIndex >= total ? [] : filterData?.slice(startIndex, endIndex);

    return NextResponse.json({
        code: 200,
        message: "分页查询成功",
        data: {
            total: total,
            list: filterData,
        }
    })
}

//添加一条数据
//POST -- /api1/sol/token
export async function POST(request: NextRequest, { params }: IParams) {
    /* const { type: p_type} = await params;
    if (!isAccessType(accessTypes,p_type)) {
        return NextResponse.json({
            code: 400,
            message: "无效的type",
            type: `无效的type--${p_type}`,
            data: "",
            //data
        })
    } */

    const { table: p_table } = await params;
    if (!isAccessType(TABLE_NAMES, p_table)) {
        return NextResponse.json({
            code: 400,
            message: "无效的 table",
            table: `无效的 table--${p_table}`,
            data: "",
            //data
        })
    }

    const data = await request.json();
    //在服务器端，打印．不会在浏览器端打印
    // console.log("OK OK，收到～")

    //push 添加方式－－尾插入
    //unshift 添加方式－－头插入
    await solLowDb[p_table as LIMIT_TABLE_NAME]?.update(({ posts }) => posts.unshift({
        //添加随机id，-8表示取后:8位        
        id: Math.random().toString(36).slice(-8),
        ...data,
    }));

    //返回一个json对象，给客户羰
    return NextResponse.json({
        code: 200,
        message: "添加成功",
        table: `Post:table--${p_table}`,
        data
    });
}

