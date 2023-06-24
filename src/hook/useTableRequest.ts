import { useEffect, useRef, useReducer } from 'react';
import request from '@/utils/request';
interface tablePropsProps {
  dataSource: any[];
  loading?:boolean;
  sumRow?:any;
  [key: string]: any;
}
export interface MDMSearchParams {
  orderBy: string; //排序字段，以及排序类型(code desc,name desc)，多个字段排序用,隔开
  page?: number; //请求页
  rows?: number; // 每页行数
  searchText?: string; //关键字
  [key: string]: any;
}
interface useTableRequestProps {
  url: string; //请求地址
  params: MDMSearchParams; //请求参数
  autoLoad?: boolean;
  deathData?: any; //数据改变不会请求
  getResponse?:boolean;
  callback?: (params: any) => void; //
  id?: string;
}
function reducer(state: tablePropsProps, action: any) {
  switch (action.type) {
    case 'setloading':
      return { ...state, loading: true };
    case 'setdata':
      return { ...action.data };
    default:
      throw new Error();
  }
}
const useTableRequest = (props: useTableRequestProps) => {
  const indexRef = useRef(0);
  const orderByref = useRef('');
  const filtesRef = useRef<any>({})
  const queryChange = useRef(0)
  const getList = (page: number, pageSize: number, orderBy = '',filtes?:any) => {
    let pramas = {
      orderBy: orderBy ? orderBy : props.params.orderBy,
      page: page,
      rows: pageSize,
      filterList:filtesRef.current
    };
    orderByref.current = pramas.orderBy;
    return getData(pramas);
  }; 
  const defaultPageSize = Number(JSON.parse(localStorage.getItem(`${window.pageCode}`) || "{}")?.[`t_${props.id}_pageSize`]) || 30;
  const [state, dispatch] = useReducer(reducer, {
    operation:[],
    dataSource: [],
    loading: false,
    onChange: getList,
    pagination: {
      total: 0,
      showTotal: (total: number) => `共${total}条`,
      defaultPageSize,
      defaultCurrent: 1,
      current: 0,
      pageSize: 0,
    },
  });
  const filterChange = (filterInfo:any)=>{
    filtesRef.current=filterInfo||{}
    let pramas = {
      orderBy: orderByref.current,
      page: 1,
      rows: state.pagination.pageSize || props.params.rows || defaultPageSize,
      filterList:filtesRef.current
    };
    orderByref.current = pramas.orderBy;
    getData(pramas);
  }



  const getData = (p: MDMSearchParams) => {
    dispatch({ type: 'setloading' });
    let update ={
      ...props.params,
      ...p,
      ...props.deathData,
      
    }
    request(props.url, {
      getResponse:props.getResponse,
      method: 'POST',
      data: {
        data: update,
        filterList:filtesRef.current

      },
    }).then(res => {
      if (res?.status === 200) {
        res.data.pageSize = p.rows;
        props.callback && props.callback(res.data);
        dispatch({
          type: 'setdata',
          data: {
            queryChange:queryChange.current,
            filterSearchParams:update,
            filterUrl:props.url,
            operation:res.operation,
            sumRow: res.data?.sumRow,
            dataSource: res.data.rows,
            loading: false,
            onChange: getList,
            filterChange:filterChange,
            pagination: {
              total: res.data.records,
              showTotal: (total: number) => `共${total}条`,
              defaultPageSize,
              defaultCurrent: 1,
              current: res.data.page,
              pageSize: res.data.pageSize,
            },
          },
        });
      } else {
        dispatch({
          type: 'setdata',
          data: {
            filterSearchParams:update,
            filterUrl:props.url,
            dataSource: [],
            loading: false,
            pagination: {
              total: 0,
              showTotal: (total: number) => `共${total}条`,
              defaultPageSize,
              defaultCurrent: 1,
              current: 0,
              pageSize: 0,
            },
          },
        });
      }
    });
  };

  useEffect(() => {
    filtesRef.current={}
    queryChange.current = queryChange.current+1
    if (props.autoLoad != false) {
      getList(
        1,
        state.pagination.pageSize || props.params.rows || defaultPageSize,
        orderByref.current,
      );
    } else {
      if (indexRef.current) {
        getList(
          1,
          state.pagination.pageSize || props.params.rows || defaultPageSize,
          orderByref.current,
        );
      } else {
        indexRef.current = 1;
      }
    }
  }, [props.params]);
  const refresh = ()=>{   
    getList(
      state.pagination.current,
      state.pagination.pageSize || props.params.rows || defaultPageSize,
      orderByref.current,
      filtesRef.current,
    );
  }
  return { tableProps: state as tablePropsProps, dispatch ,refresh};
};

export default useTableRequest;
