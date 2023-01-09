export enum SortingType {
    ASC = "ASC",
    DESC = "DESC",
}

export interface ISearchExpression {
    tableName?: string,
    columnName?: string,

}

export interface ISortExpression{
    tableName?: string,
    sortColumn?: string,
    sortType?: SortingType
}


export interface PageOptionsDto {
    pageNumber?: number;
    pageSize?: number;
    searchExpression?: ISearchExpression;
    searchQuery: string;
    sortExpressions: ISortExpression
}
