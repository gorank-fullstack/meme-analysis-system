

/* 
const fetcher = (...args) => fetch(...args).then((res) => res.json())
原版js代码 */
// export const fetcher = (...args: Parameters<typeof fetch>): Promise<unknown> => 
//     fetch(...args).then((res) => res.json());
// export const fetcher = (url: string) => fetch(url).then((res) => res.json());


/* const fetcher = <T>(...args: Parameters<typeof fetch>): Promise<T> => 
  fetch(...args).then((res) => res.json() as T); */
/* export const fetchUser = async () => {
    const user = await fetcher<User>('/api/user');
    console.log(user.name);
  }; */
/*   function Profile() {
    const { data, error, isLoading } = useSWR("/api/user/123", fetcher)
  
    if (error) return <div>failed to load</div>
    if (isLoading) return <div>loading...</div>
  
    // 渲染数据
    return <div>hello {data.name}!</div>
  } */