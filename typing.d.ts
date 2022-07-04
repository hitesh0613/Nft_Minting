interface Image{
    asset :{
        url:string
    }
}

export interface creator{
    _id:String,
    bio:String,
    address:String,
    slug:{
    current:String
  }
  image:Image
}


export interface Collection{
    _id:String,
    title:String,
    address:String,
    description:String,
    nftcollectipn:String,
  slug:{
    current:String 
}
creator:creator
mainImage:Image
previewImage:Image

}