import { NextRequest, NextResponse } from "next/server";
import { solLowDb } from "@/myLowdb";
import { isAccessType } from "@/utils/normal";
// import {IToken,IKline,ITrx} from "@/myLowdb";
import { TABLE_NAMES, TABLE_QUERY_FIELDS, LOWDB_TABLE_QUERY_FIELD,LIMIT_TABLE_NAME } from "@/config/web3_constants";
/* interface IParams{
    params: {id: string }
} */
interface IParams {
    params: Promise<{
        table: string,
        field: string,
        querystr: string
    }>
}


// const accessTypes: string[] = ["token", "kline", "trx"];

//删除一条数据
//DELETE -- /api1/sol/token/:id
export async function DELETE(request: NextRequest, { params }: IParams) {
    // const p_address = await params.then((value) => value.address)
    const { table: p_table, field: p_field, querystr: p_query_str } = await params;

    if (!isAccessType(TABLE_NAMES, p_table)) {
        return NextResponse.json({
            code: 400,
            message: "无效的 table",
            table: `无效的 table--${p_table}`,
            data: "",
            //data
        })
    }

    if (!isAccessType(TABLE_QUERY_FIELDS, p_field)) {
        return NextResponse.json({
            code: 400,
            message: "无效的 field",
            field: `无效的 field--${p_field}`,
            data: "",
            //data
        })
    }

    let idx = -1;
    // type DbName = "token" | "kline" | "trx";
    // const dbName: DbName =p_table as DbName;; // 正确

    await solLowDb[p_table as LIMIT_TABLE_NAME]?.update(({ posts }) => {
    // await getSolLowDb(p_table).update(({ posts }) => {
        //找不到时：findIndex 返回 -1
        // idx = posts.findIndex((post) => post.id === p_id);
        if (p_field === LOWDB_TABLE_QUERY_FIELD.CA) {
            idx = posts.findIndex((post) => post.ca === p_query_str);
        } else if (p_field === LOWDB_TABLE_QUERY_FIELD.AA) {
            idx = posts.findIndex((post) => post.aa === p_query_str);
        }

        //console.log('idx=',idx)
        if (idx !== -1) {
            posts.splice(idx, 1);   //删除１个idx
            //    deleteOk = true;
        }
    })

    if (idx !== -1) {
        //const data =request.json();
        return NextResponse.json({
            code: 200,
            message: "删除成功----详细如下：",
            table: `Del:table--${p_table}`,
            field: `Del:--field--${p_field}`,
            querystr: `Del:----querystr--${p_query_str}`,
            data: "",
            //data
        })
    } else {
        return NextResponse.json({
            code: 400,
            message: "查找不到，删除失败----详细如下：",
            table: `Del:table--${p_table}`,
            field: `Del:--field--${p_field}`,
            querystr: `Del:----querystr--${p_query_str}`,
            data: "",
            //data
        })
    }
}

//修改一条数据
//PATCH -- /api1/sol/token/:id
export async function PATCH(request: NextRequest, { params }: IParams) {
    const data = await request.json();
    let idx = -1;

    
    // const p_address = await params.then((value) => value.address);
    const { table: p_table,field: p_field, querystr: p_query_str } = await params;

    if (!isAccessType(TABLE_NAMES, p_table)) {
        return NextResponse.json({
            code: 400,
            message: "无效的 table",
            table: `无效的 table--${p_table}`,
            data: "",
            //data
        })
    }

    if (!isAccessType(TABLE_QUERY_FIELDS, p_field)) {
        return NextResponse.json({
            code: 400,
            message: "无效的 field",
            field: `无效的 field--${p_field}`,
            data: "",
            //data
        })
    }
    //let changeOk = false;

    // await solToken_LowDb.update(({ posts }) => {
    await solLowDb[p_table as LIMIT_TABLE_NAME]?.update(({ posts }) => {
        //找不到时：findIndex 返回 -1
        // idx = posts.findIndex((post) => post.id === p_id);
        if (p_field === LOWDB_TABLE_QUERY_FIELD.CA) {
            idx = posts.findIndex((post) => post.ca === p_query_str);
        } else if (p_field === LOWDB_TABLE_QUERY_FIELD.AA) {
            idx = posts.findIndex((post) => post.aa === p_query_str);
        }
        
        //console.log('idx=',idx)
        if (idx !== -1) {

            //更新 posts 里，idx 对应的对象，更新为 data (将：posts[idx]展开，更新为展开后的data)
            posts[idx] = { ...posts[idx], ...data };
            //    changeOk = true;
        }
    })

    if (idx !== -1) {
        //const data =request.json();
        return NextResponse.json({
            code: 200,
            message: "修改成功----详细如下：",
            table: `Patch:table--${p_table}`,
            field: `Patch:--field--${p_field}`,
            querystr: `Patch:----querystr--${p_query_str}`,
            dtat: solLowDb[p_table as LIMIT_TABLE_NAME]?.data.posts[idx],
            //data
        })
    } else {
        return NextResponse.json({
            code: 400,
            message: "查找不到，修改失败----详细如下：",
            table: `Patch:table--${p_table}`,
            field: `Patch:--field--${p_field}`,
            querystr: `Patch:----querystr--${p_query_str}`,
            data: "",  //查找失败时，也应该返回一个空的data给前端
            //data
        })
    }

}

//查询一条数据
//GET -- /api1/sol/token/:id
export async function GET(request: NextRequest, { params }: IParams) {
    //let idx = -1;
    // const p_address = await params.then((value) => value.address);
    const { table: p_table,field: p_field, querystr: p_query_str } = await params;

    if (!isAccessType(TABLE_NAMES, p_table)) {
        return NextResponse.json({
            code: 400,
            message: "无效的 table",
            table: `无效的 table--${p_table}`,
            data: "",
            //data
        })
    }

    if (!isAccessType(TABLE_QUERY_FIELDS, p_field)) {
        return NextResponse.json({
            code: 400,
            message: "无效的 field",
            field: `无效的 field--${p_field}`,
            data: "",
            //data
        })
    }
    // const data = solToken_LowDb.data.posts.find((post) => post.id === p_id);
    const data = solLowDb[p_table as LIMIT_TABLE_NAME]?.data.posts.find((post) => post.ca === p_query_str);
    
    /* 如果 posts.find((post) => post.id === p_id) 
    没有找到符合条件的 post，那么 data 的值将是 undefined */
    if (data !== undefined) {
        // 处理找到的逻辑
        return NextResponse.json({
            code: 200,
            message: "查找成功----详细如下：",
            table: `Get:table--${p_table}`,
            field: `Get:--field--${p_field}`,
            querystr: `Get:----querystr--${p_query_str}`,
            /* id: `查找id--${params.id}`, */
            data,

        })
    } else {
        // 处理未找到的逻辑
        return NextResponse.json({
            code: 400,
            message: "查找不到，查找失败----详细如下：",
            table: `Get:table--${p_table}`,
            field: `Get:--field--${p_field}`,
            querystr: `Get:----querystr--${p_query_str}`,
            data: "",  //查找失败时，也应该返回一个空的data给前端
            //data
        })
    }
}