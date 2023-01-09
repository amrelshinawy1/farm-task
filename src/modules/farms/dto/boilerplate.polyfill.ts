/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Brackets, ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { PageMetaDto } from "./pageMetaDto";
import { ISearchExpression, ISortExpression, PageOptionsDto } from "./pageOptionsDto";



export const searchByString = <Entity extends ObjectLiteral = any>(query: SelectQueryBuilder<Entity>, searchKey: string, searchExpression?: ISearchExpression
): void => {

  if (!searchKey) {
    return;
  }
  if (searchExpression?.columnName) {
    query.andWhere(new Brackets(queryBrackets => {
      const tableName = searchExpression.tableName;
      queryBrackets.orWhere(`${tableName}.${searchExpression.columnName} LIKE :searchKey`);
    }
    ));
  } else {
    query.andWhere(new Brackets(queryBrackets => {
      query.expressionMap.selects.forEach(element => {
        queryBrackets.orWhere(`${element.selection} LIKE :searchKey`);
      });
    }));
  }

  query.setParameter("searchKey", `%${searchKey}%`);

};

export const sortResult = <Entity extends ObjectLiteral = any>(query: SelectQueryBuilder<Entity>, sortExpressions: ISortExpression): void => {
  if (typeof sortExpressions === "string") {
    sortExpressions = JSON.parse(sortExpressions);
  }
  if (!sortExpressions || !sortExpressions.sortColumn) {
    return;
  }

  const tableName = sortExpressions.tableName;
  query.addOrderBy(`${tableName}.${sortExpressions.sortColumn}`, sortExpressions.sortType);
};

export const paginate = 
async <Entity extends ObjectLiteral = any>(query: SelectQueryBuilder<Entity>, pageOptionsDto: PageOptionsDto)
  : Promise<[Entity[], PageMetaDto]> => {

  searchByString(query, pageOptionsDto.searchQuery, pageOptionsDto.searchExpression);
  sortResult(query, pageOptionsDto.sortExpressions);

  const pageNumber: number = Number(pageOptionsDto.pageNumber) || 1;
  const pageSize: number = Number(pageOptionsDto.pageSize) || 1000;

  const skip: number = (pageNumber - 1) * pageSize;

  const [items, itemCount] = await query.skip(skip)
    .take(pageSize)
    .getManyAndCount();
  const pageCount = Math.ceil(itemCount / pageSize);

  const pageMetaDto = {
    itemCount,
    pageNumber,
    pageSize,
    pageCount,
    hasPreviousPage: pageNumber > 1,
    hasNextPage: pageNumber < pageCount
  };
  return [items, pageMetaDto];
};
