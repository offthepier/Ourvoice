export interface IComment {
  id: number;
  name?: string;
  comment?: string;
  type?: string;
}

export type PostType = {
  id: number;
  name?: string;
  postTitle: string;
  img?: string;
  desc: string;
  type?: string;
  comment?: IComment[];
};

const PostList: PostType[] = [
  {
    id: 1,
    postTitle: "Powercuts",
    name: "Oliver William",
    desc: "Minister of Power and Energy Kanchana Wijesekera has warned that in the event electricity tariffs are not increased as per the requirements listed by the Ceylon Electricity Board (CEB), extended power cuts will have to be imposed.",
    type: "General",
    img: "https://images.unsplash.com/photo-1521575107034-e0fa0b594529?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cG9zdHxlbnwwfHwwfHw%3D&w=1000&q=80",
    comment: [
      {
        id: 1,
        name: "Nimal",
        type: "General",
        comment:
          "Minister of Power and Energy Kanchana Wijesekera has warned that in the event electricity tariffs are not increased as per the requirements listed by the Ceylon Electricity Board (CEB), extended power cuts will have to be imposed.",
      },
      {
        id: 2,
        name: "Kavindu",
        type: "Argument",
        comment:
          "Minister of Power and Energy Kanchana Wijesekera has warned that in the event electricity tariffs are not increased as per the requirements listed by the Ceylon Electricity Board (CEB), extended power cuts will have to be imposed.",
      },
    ],
  },
  {
    id: 2,
    postTitle: " Renewable energies",
    name: "Oliver William",
    desc: "Renewable energy is energy that is collected from renewable resources that are naturally replenished on a human timescale. It includes sources such as sunlight, wind, the movement of water, and geothermal heat. ",
    type: "General",
    img: "https://www.activesustainability.com/media/816094/argumentos-energias-renovables.jpg",
    comment: [
      {
        id: 1,
        name: "Nimal",
        type: "General",
        comment:
          "Minister of Power and Energy Kanchana Wijesekera has warned that in the event electricity tariffs are not increased as per the requirements listed by the Ceylon Electricity Board (CEB), extended power cuts will have to be imposed.",
      },
      {
        id: 2,
        name: "Kavindu",
        type: "General",
        comment:
          "Minister of Power and Energy Kanchana Wijesekera has warned that in the event electricity tariffs are not increased as per the requirements listed by the Ceylon Electricity Board (CEB), extended power cuts will have to be imposed.",
      },
    ],
  },
  {
    id: 3,
    postTitle: "Global Warming.",
    name: "Oliver William",
    desc: "Planting new trees is one of the most effective ways to reduce atmospheric carbon dioxide (CO2) and limit global warming",
    type: "Solution",
    comment: [
      {
        id: 1,
        name: "Nimal",
        type: "General",
        comment:
          "Minister of Power and Energy Kanchana Wijesekera has warned that in the event electricity tariffs are not increased as per the requirements listed by the Ceylon Electricity Board (CEB), extended power cuts will have to be imposed.",
      },
      {
        id: 2,
        name: "Kavindu",
        type: "General",
        comment:
          "Minister of Power and Energy Kanchana Wijesekera has warned that in the event electricity tariffs are not increased as per the requirements listed by the Ceylon Electricity Board (CEB), extended power cuts will have to be imposed.",
      },
    ],
  },
];

export { PostList };
