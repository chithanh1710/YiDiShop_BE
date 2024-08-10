import { __PAGE_DEFAULT, __PAGE_LIMIT } from "../constants/PAGE";
import Product from "../models/Product.model";

class APIFeatures {
  private query: any;
  private queryString: any;
  private model: any;
  private page: number;
  private limit: number;
  private sort: any | undefined;
  private fields: string | undefined;
  private skip: number;
  private totalItem: number | undefined;
  private totalPage: number | undefined;

  constructor(query: any, queryString: any, model: any) {
    this.query = query;
    this.queryString = queryString;
    this.model = model;

    this.page = queryString.page || __PAGE_DEFAULT;
    this.limit = queryString.limit || __PAGE_LIMIT;

    this.sort = queryString.sort;
    this.fields = queryString.fields;

    this.skip = (this.page - 1) * this.limit;
    this.totalItem = undefined;
    this.totalPage = undefined;
  }

  get getQuery() {
    return this.query;
  }

  async Validate() {
    if (this.page <= 0) throw new Error("Invalid page number!!! (page > 0)");

    if (this.limit <= 0 || this.limit >= 50)
      throw new Error("Invalid limit number!!! (0 - 50)");

    this.totalItem = await this.model.countDocuments();
    if (!this.totalItem || this.totalItem <= 0)
      throw new Error("Not found data");

    this.totalPage = Math.ceil(this.totalItem / this.limit);
    if (this.page > this.totalPage)
      throw new Error(
        `Current page number is greater than total page number!!! (page < ${this.totalPage})`
      );

    return this;
  }

  Filter() {
    const queryObj: any = { ...this.queryString };
    const excludedFields = ["page", "limit", "sort", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = JSON.parse(
      queryStr
        .replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
        .replace(/"(\w+)":\s?"(.*?)"/g, (match, p1, p2) => {
          if (["name", "summary", "description"].includes(p1)) {
            return `"${p1}": {"$regex": "${p2}", "$options": "i"}`;
          }
          return match;
        })
    );
    console.log("filter: ", queryStr);
    this.query = this.query.find(queryStr);
    return this;
  }

  Sort() {
    if (
      this.sort &&
      typeof this.sort === "object" &&
      Object.keys(this.sort).length > 0
    ) {
      const validSortDirections = ["asc", "desc", "-1", "1"];
      const sortTmp = Object.keys(this.sort).reduce((acc: any, key) => {
        console.log(`this.sort[${key}]: `, this.sort[key]);
        if (validSortDirections.includes(this.sort[key])) {
          if (this.sort[key] === "-1" || this.sort[key] === "1") {
            acc[key] = Number(this.sort[key]);
          } else {
            acc[key] = this.sort[key];
          }
        }
        return acc;
      }, {});
      this.query = this.query.sort(sortTmp);
    } else {
      this.query = this.query.sort("-createAt");
    }

    return this;
  }

  SkipAndLimit() {
    // console.log(`skip: ${this.skip}\nlimit: ${this.limit}`);
    this.query = this.query.skip(this.skip).limit(this.limit);
    return this;
  }

  Fields() {
    // console.log(this.queryString);
    console.log(`fields: ${this.fields}`);
    if (this.fields) {
      const fieldArray = this.fields.split(",").join(" ");
      this.query = this.query.select(fieldArray);
    } else this.query = this.query.select("-__v");

    return this;
  }
}

export default APIFeatures;
