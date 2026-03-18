/*  
    ALAi:reduxjstoolkit(RTK)的案例中 store/hooks.ts文件 的作用
    TypedUseSelectorHook: 这是一个辅助类型，用于创建一个类型安全的 useSelector 钩子。
    RootState 和 AppDispatch: 这些是从当前目录下(@/store/)的 index.ts 文件中导入的类型定义，分别表示 Redux store 的状态和 dispatch 方法的类型。
 */
/* 
`   为什么需要自定义钩子？
    尽管可以直接使用 useDispatch 和 useSelector，但创建自定义钩子有几个显著的优势：

    类型安全：通过明确指定 AppDispatch 和 RootState 类型，我们确保了所有对 Redux store 的访问都是类型安全的，减少了运行时错误的可能性。
    代码一致性：在整个项目中统一使用 useAppDispatch 和 useAppSelector，而不是直接使用 useDispatch 和 useSelector，可以提高代码的一致性和可读性。
    易于维护：如果未来需要更改 store 的结构或类型定义，只需要更新 hooks.ts 文件中的类型定义即可，而不需要修改每个使用了这些钩子的地方。`
 */
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/index';

// 使用泛型扩展 useDispatch 和 useSelector 的类型
/* 
    这段代码定义了一个名为 useAppDispatch 的自定义钩子，它实际上只是对 useDispatch 的简单包装。
    通过指定其返回类型为 AppDispatch，我们确保了从这个钩子返回的 dispatch 方法能够正确处理我们的应用中定义的动作类型。
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppDispatch: () => AppDispatch = useDispatch;

/* 
    这里定义了一个名为 useAppSelector 的自定义钩子，它是对 useSelector 的包装，
    并使用了 TypedUseSelectorHook 来指定其参数和返回值的类型为 RootState。
    这样做的好处是，当我们在组件中使用 useAppSelector 时，TypeScript 能够根据 RootState 的定义自动推断出选择器函数的输入和输出类型。
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;