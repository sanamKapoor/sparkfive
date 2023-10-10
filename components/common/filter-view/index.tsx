//🚧 work in progress 🚧
import React, { useEffect, useState } from "react";

import { Utilities } from "../../../assets";
import { IAttribute } from "../../../interfaces/filters";
import tagsApi from "../../../server-api/tag";
import teamApi from "../../../server-api/team";

import IconClickable from "../buttons/icon-clickable";
import styles from "./index.module.css"
import FilterOptionPopup from "../filter-option-popup";
import Button from "../buttons/button";

const FilterView = () => {
  const [attrs, setAttrs] = useState<IAttribute[]>([{id: 'tags', name: 'Tags', type: 'pre-defined'}, {id: 'aiTags', name: 'AI Tags', type: 'pre-defined'}, {id: '789485-fdfh49584h', name: 'Services', type: 'custom'}]);
  const [values, setValues] = useState([
    {
        "createdAt": "2022-07-19T20:22:13.558Z",
        "numberOfFiles": "375",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Person",
        "count": "375",
        "id": "4ce10675-e407-486b-9582-099cb3f1f163",
        "type": "AI",
        "updatedAt": "2022-07-19T20:22:13.558Z"
    },
    {
        "createdAt": "2022-07-22T15:56:58.480Z",
        "numberOfFiles": "343",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Text",
        "count": "343",
        "id": "47b18c42-06e3-40b7-a8f8-de7cb947bf34",
        "type": "AI",
        "updatedAt": "2022-07-22T15:56:58.480Z"
    },
    {
        "createdAt": "2022-07-22T16:15:16.994Z",
        "numberOfFiles": "251",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Symbol",
        "count": "251",
        "id": "442e2e35-5f29-47dd-bb20-32686891d87c",
        "type": "AI",
        "updatedAt": "2022-07-22T16:15:16.994Z"
    },
    {
        "createdAt": "2022-12-28T14:42:26.864Z",
        "numberOfFiles": "189",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Adult",
        "count": "189",
        "id": "76bffb50-66ec-4af1-901f-72d9ed6bb95f",
        "type": "AI",
        "updatedAt": "2022-12-28T14:42:26.864Z"
    },
    {
        "createdAt": "2022-07-22T15:57:02.527Z",
        "numberOfFiles": "183",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Outdoors",
        "count": "183",
        "id": "24ee119c-f54f-4a23-a154-945444b9681b",
        "type": "AI",
        "updatedAt": "2022-07-22T15:57:02.527Z"
    },
    {
        "createdAt": "2022-10-19T15:41:46.969Z",
        "numberOfFiles": "147",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Face",
        "count": "147",
        "id": "87ee9e34-20cb-45f8-bd92-2e93ac1df06c",
        "type": "AI",
        "updatedAt": "2022-10-19T15:41:46.969Z"
    },
    {
        "createdAt": "2022-07-22T16:15:18.342Z",
        "numberOfFiles": "146",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Nature",
        "count": "146",
        "id": "a74b1d33-8d87-418d-b59d-a9daee20c319",
        "type": "AI",
        "updatedAt": "2022-07-22T16:15:18.342Z"
    },
    {
        "createdAt": "2022-10-19T15:41:46.970Z",
        "numberOfFiles": "141",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Electronics",
        "count": "141",
        "id": "4ae1bc26-b2c3-4de3-a39f-eb5ffdda3d79",
        "type": "AI",
        "updatedAt": "2022-10-19T15:41:46.970Z"
    },
    {
        "createdAt": "2022-07-26T11:20:29.637Z",
        "numberOfFiles": "134",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "File",
        "count": "134",
        "id": "41ffebfd-61c9-43ac-ae6e-1c0075145e59",
        "type": "AI",
        "updatedAt": "2022-07-26T11:20:29.637Z"
    },
    {
        "createdAt": "2022-07-26T11:20:29.636Z",
        "numberOfFiles": "122",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Page",
        "count": "122",
        "id": "9dc60f37-c5f4-465a-8d1a-61a1de8f6949",
        "type": "AI",
        "updatedAt": "2022-07-26T11:20:29.636Z"
    },
    {
        "createdAt": "2022-12-28T14:42:26.863Z",
        "numberOfFiles": "116",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Head",
        "count": "116",
        "id": "25f8773a-f349-4e21-bcc8-88e337ebddc5",
        "type": "AI",
        "updatedAt": "2022-12-28T14:42:26.863Z"
    },
    {
        "createdAt": "2022-10-23T20:15:08.796Z",
        "numberOfFiles": "115",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Female",
        "count": "115",
        "id": "176613bf-6fe4-4879-a8c3-02844963969a",
        "type": "AI",
        "updatedAt": "2022-10-23T20:15:08.796Z"
    },
    {
        "createdAt": "2022-10-23T20:15:08.798Z",
        "numberOfFiles": "115",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Woman",
        "count": "115",
        "id": "53ddf2d5-250e-4dfc-b98d-6af2ab50e0e9",
        "type": "AI",
        "updatedAt": "2022-10-23T20:15:08.798Z"
    },
    {
        "createdAt": "2023-01-24T20:07:49.727Z",
        "numberOfFiles": "114",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sign",
        "count": "114",
        "id": "4d2684be-b782-4294-be84-4878ef6009f9",
        "type": "AI",
        "updatedAt": "2023-01-24T20:07:49.727Z"
    },
    {
        "createdAt": "2022-07-22T15:54:41.442Z",
        "numberOfFiles": "108",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Furniture",
        "count": "108",
        "id": "32d7a2bb-0e49-4e0a-8a9a-679f7ed1880d",
        "type": "AI",
        "updatedAt": "2022-07-22T15:54:41.442Z"
    },
    {
        "createdAt": "2022-12-28T14:42:26.865Z",
        "numberOfFiles": "108",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Man",
        "count": "108",
        "id": "281d6e7e-6d32-4405-841c-661bb4de3476",
        "type": "AI",
        "updatedAt": "2022-12-28T14:42:26.865Z"
    },
    {
        "createdAt": "2022-12-28T14:42:26.865Z",
        "numberOfFiles": "103",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Male",
        "count": "103",
        "id": "c0282ed8-2baf-47c9-808c-2ffae18eee9c",
        "type": "AI",
        "updatedAt": "2022-12-28T14:42:26.865Z"
    },
    {
        "createdAt": "2022-07-22T16:15:16.993Z",
        "numberOfFiles": "88",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Logo",
        "count": "88",
        "id": "ef7d4e83-4469-4db0-8cc3-225ab6f9dc89",
        "type": "AI",
        "updatedAt": "2022-07-22T16:15:16.993Z"
    },
    {
        "createdAt": "2022-08-09T21:07:58.612Z",
        "numberOfFiles": "88",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Webpage",
        "count": "88",
        "id": "cb8a7721-baa4-4f12-89db-97f1ad6f144e",
        "type": "AI",
        "updatedAt": "2022-08-09T21:07:58.612Z"
    },
    {
        "createdAt": "2022-07-22T15:54:48.786Z",
        "numberOfFiles": "86",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Building",
        "count": "86",
        "id": "ff1366fa-6915-4164-b415-b071f1fd1f09",
        "type": "AI",
        "updatedAt": "2022-07-22T15:54:48.786Z"
    },
    {
        "createdAt": "2023-01-23T19:34:54.379Z",
        "numberOfFiles": "85",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Weapon",
        "count": "85",
        "id": "42cd91dc-1020-4d98-bf29-33957be621e6",
        "type": "AI",
        "updatedAt": "2023-01-23T19:34:54.379Z"
    },
    {
        "createdAt": "2022-07-22T15:54:39.005Z",
        "numberOfFiles": "84",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Indoors",
        "count": "84",
        "id": "4641e93b-274d-4616-92f6-14c187122aee",
        "type": "AI",
        "updatedAt": "2022-07-22T15:54:39.005Z"
    },
    {
        "createdAt": "2023-06-28T08:21:28.546Z",
        "numberOfFiles": "78",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Hardware",
        "count": "78",
        "id": "b85646ab-f3f3-447c-bf2c-1c3515540959",
        "type": "AI",
        "updatedAt": "2023-06-28T08:21:28.546Z"
    },
    {
        "createdAt": "2022-07-22T15:54:48.786Z",
        "numberOfFiles": "76",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Plant",
        "count": "76",
        "id": "e85679d1-25dd-417e-acf5-518ca542d9bb",
        "type": "AI",
        "updatedAt": "2022-07-22T15:54:48.786Z"
    },
    {
        "createdAt": "2022-07-22T15:54:41.441Z",
        "numberOfFiles": "68",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Interior Design",
        "count": "68",
        "id": "979cd028-9fe8-4c2e-af85-3814155f7100",
        "type": "AI",
        "updatedAt": "2022-07-22T15:54:41.441Z"
    },
    {
        "createdAt": "2022-10-19T15:41:46.971Z",
        "numberOfFiles": "66",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Photography",
        "count": "66",
        "id": "fff099ce-8077-455b-8dda-cf2796bc62c2",
        "type": "AI",
        "updatedAt": "2022-10-19T15:41:46.971Z"
    },
    {
        "createdAt": "2022-08-09T21:12:51.219Z",
        "numberOfFiles": "64",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Architecture",
        "count": "64",
        "id": "eb8d822e-b117-4eb8-acba-339971aef78e",
        "type": "AI",
        "updatedAt": "2022-08-09T21:12:51.219Z"
    },
    {
        "createdAt": "2022-10-19T15:41:46.970Z",
        "numberOfFiles": "61",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Portrait",
        "count": "61",
        "id": "ba69fc55-71f8-4340-b597-cd5fd45619d8",
        "type": "AI",
        "updatedAt": "2022-10-19T15:41:46.970Z"
    },
    {
        "createdAt": "2023-03-06T16:57:49.377Z",
        "numberOfFiles": "60",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Laptop",
        "count": "60",
        "id": "1434d873-72f2-4c97-8d32-c6dc00a4454e",
        "type": "AI",
        "updatedAt": "2023-03-06T16:57:49.377Z"
    },
    {
        "createdAt": "2022-07-22T15:56:58.481Z",
        "numberOfFiles": "57",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Advertisement",
        "count": "57",
        "id": "046fb8e0-e9c6-431f-8beb-fe902fb50f34",
        "type": "AI",
        "updatedAt": "2022-07-22T15:56:58.481Z"
    },
    {
        "createdAt": "2022-07-22T16:15:30.729Z",
        "numberOfFiles": "56",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Number",
        "count": "56",
        "id": "56e88510-e23c-41ba-8db5-bf040ae07a3f",
        "type": "AI",
        "updatedAt": "2022-07-22T16:15:30.729Z"
    },
    {
        "createdAt": "2023-06-22T12:42:50.368Z",
        "numberOfFiles": "55",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Pc",
        "count": "55",
        "id": "6510786e-1937-4a43-9ad1-ad44a8346766",
        "type": "AI",
        "updatedAt": "2023-06-22T12:42:50.368Z"
    },
    {
        "createdAt": "2022-08-01T15:43:56.271Z",
        "numberOfFiles": "53",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Food",
        "count": "53",
        "id": "35a32912-db22-4084-af53-6a789ddc3de5",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:56.271Z"
    },
    {
        "createdAt": "2022-07-22T15:54:39.004Z",
        "numberOfFiles": "52",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Room",
        "count": "52",
        "id": "51e4c25f-d38a-4202-919e-2bc84c59296c",
        "type": "AI",
        "updatedAt": "2022-07-22T15:54:39.004Z"
    },
    {
        "createdAt": "2023-01-23T19:34:59.629Z",
        "numberOfFiles": "52",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Night",
        "count": "52",
        "id": "df567995-7e65-4ec3-971d-e71106fdd82f",
        "type": "AI",
        "updatedAt": "2023-01-23T19:34:59.629Z"
    },
    {
        "createdAt": "2022-10-19T15:41:46.970Z",
        "numberOfFiles": "50",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Mobile Phone",
        "count": "50",
        "id": "d3b3e5c6-b074-4e3e-8671-6f25ef31bef1",
        "type": "AI",
        "updatedAt": "2022-10-19T15:41:46.970Z"
    },
    {
        "createdAt": "2023-01-23T19:34:59.170Z",
        "numberOfFiles": "50",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Smile",
        "count": "50",
        "id": "a1ea7680-81ee-469a-9c55-79327413b5d3",
        "type": "AI",
        "updatedAt": "2023-01-23T19:34:59.170Z"
    },
    {
        "createdAt": "2023-06-29T08:58:48.178Z",
        "numberOfFiles": "48",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Road Sign",
        "count": "48",
        "id": "6468fab7-dad5-4bce-b62d-19e291106c38",
        "type": "AI",
        "updatedAt": "2023-06-29T08:58:48.178Z"
    },
    {
        "createdAt": "2022-07-22T15:57:03.351Z",
        "numberOfFiles": "47",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Accessories",
        "count": "47",
        "id": "e6a6ca15-fdcd-4178-b127-125dcd4da448",
        "type": "AI",
        "updatedAt": "2022-07-22T15:57:03.351Z"
    },
    {
        "createdAt": "2022-07-22T15:56:58.481Z",
        "numberOfFiles": "46",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Poster",
        "count": "46",
        "id": "381ef5ae-2cf4-4d9a-967d-9bdcd662f0ed",
        "type": "AI",
        "updatedAt": "2022-07-22T15:56:58.481Z"
    },
    {
        "createdAt": "2022-10-19T15:41:46.970Z",
        "numberOfFiles": "46",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Phone",
        "count": "46",
        "id": "54516e28-ccfb-457f-b8dd-4aab5decf1fe",
        "type": "AI",
        "updatedAt": "2022-10-19T15:41:46.970Z"
    },
    {
        "createdAt": "2022-09-04T04:58:35.905Z",
        "numberOfFiles": "45",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Shoe",
        "count": "45",
        "id": "cfa1f69a-e5ec-4640-9727-cbdf2b0d39a7",
        "type": "AI",
        "updatedAt": "2022-09-04T04:58:35.905Z"
    },
    {
        "createdAt": "2023-03-23T21:41:18.896Z",
        "numberOfFiles": "43",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Computer Hardware",
        "count": "43",
        "id": "0e19fc18-b240-45ac-9547-5b5a2f6dd6cf",
        "type": "AI",
        "updatedAt": "2023-03-23T21:41:18.896Z"
    },
    {
        "createdAt": "2022-08-01T15:43:05.189Z",
        "numberOfFiles": "42",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Water",
        "count": "42",
        "id": "c8a5b470-ba61-4845-974b-3dbe6765a45d",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:05.189Z"
    },
    {
        "createdAt": "2022-11-11T21:10:18.614Z",
        "numberOfFiles": "42",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Lighting",
        "count": "42",
        "id": "93f5741f-aceb-46bf-9f22-cea29b6fbd46",
        "type": "AI",
        "updatedAt": "2022-11-11T21:10:18.614Z"
    },
    {
        "createdAt": "2022-07-22T15:54:48.787Z",
        "numberOfFiles": "40",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Grass",
        "count": "40",
        "id": "8c836651-0f6b-4a06-9cec-22edbe077f43",
        "type": "AI",
        "updatedAt": "2022-07-22T15:54:48.787Z"
    },
    {
        "createdAt": "2023-01-23T19:35:01.415Z",
        "numberOfFiles": "40",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Moon",
        "count": "40",
        "id": "c686ed6d-6a10-44ff-9b78-3ca0cac8c2cd",
        "type": "AI",
        "updatedAt": "2023-01-23T19:35:01.415Z"
    },
    {
        "createdAt": "2023-02-09T14:51:18.382Z",
        "numberOfFiles": "38",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Bag",
        "count": "38",
        "id": "6aa11d62-f48e-4515-a90e-818fb93d4286",
        "type": "AI",
        "updatedAt": "2023-02-09T14:51:18.382Z"
    },
    {
        "createdAt": "2022-11-04T19:47:02.897Z",
        "numberOfFiles": "36",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Triangle",
        "count": "36",
        "id": "7827dd53-3e1d-4049-94ba-c1acf41e4b8b",
        "type": "AI",
        "updatedAt": "2022-11-04T19:47:02.897Z"
    },
    {
        "createdAt": "2023-03-23T21:41:18.896Z",
        "numberOfFiles": "36",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Screen",
        "count": "36",
        "id": "6b9a43f7-f152-4b8f-b302-f7ba9b065578",
        "type": "AI",
        "updatedAt": "2023-03-23T21:41:18.896Z"
    },
    {
        "createdAt": "2023-03-23T21:41:18.897Z",
        "numberOfFiles": "35",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Monitor",
        "count": "35",
        "id": "773eb99a-dcda-4125-b5b0-ea2653be91c7",
        "type": "AI",
        "updatedAt": "2023-03-23T21:41:18.897Z"
    },
    {
        "createdAt": "2023-06-28T08:21:28.530Z",
        "numberOfFiles": "34",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Computer",
        "count": "34",
        "id": "91bc1086-da1e-495e-b4c9-8810d632e31a",
        "type": "AI",
        "updatedAt": "2023-06-28T08:21:28.530Z"
    },
    {
        "createdAt": "2023-02-09T14:50:53.545Z",
        "numberOfFiles": "33",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Coat",
        "count": "33",
        "id": "95edc994-57f1-4f2c-ba97-6d91742171c6",
        "type": "AI",
        "updatedAt": "2023-02-09T14:50:53.545Z"
    },
    {
        "createdAt": "2022-07-27T13:35:37.054Z",
        "numberOfFiles": "31",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Machine",
        "count": "31",
        "id": "084a68b9-8b3c-46f0-ac02-75e40970f364",
        "type": "AI",
        "updatedAt": "2022-07-27T13:35:37.054Z"
    },
    {
        "createdAt": "2023-06-26T12:33:18.978Z",
        "numberOfFiles": "31",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Grenade",
        "count": "31",
        "id": "ad78456b-c237-45c1-a55d-d72bbd994786",
        "type": "AI",
        "updatedAt": "2023-06-26T12:33:18.978Z"
    },
    {
        "createdAt": "2022-07-22T19:01:36.454Z",
        "numberOfFiles": "29",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Clothing",
        "count": "29",
        "id": "24d999b1-9dde-40f7-8390-7b9a306770ea",
        "type": "AI",
        "updatedAt": "2022-07-22T19:01:36.454Z"
    },
    {
        "createdAt": "2022-07-22T15:54:41.441Z",
        "numberOfFiles": "28",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Floor",
        "count": "28",
        "id": "95a4b1d6-48ed-45e6-8581-379efa0b2848",
        "type": "AI",
        "updatedAt": "2022-07-22T15:54:41.441Z"
    },
    {
        "createdAt": "2022-08-09T21:13:34.795Z",
        "numberOfFiles": "28",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Scenery",
        "count": "28",
        "id": "2c1622f0-e35b-47a3-9b3f-c8c365bd5623",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:34.795Z"
    },
    {
        "createdAt": "2022-12-28T14:42:26.864Z",
        "numberOfFiles": "28",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Neck",
        "count": "28",
        "id": "ba73035d-dd25-4e9e-9ec9-54842f0a22cb",
        "type": "AI",
        "updatedAt": "2022-12-28T14:42:26.864Z"
    },
    {
        "createdAt": "2022-07-22T15:54:48.785Z",
        "numberOfFiles": "27",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Housing",
        "count": "27",
        "id": "0dc34a0f-ccb5-4df2-aa57-13e75ac70b28",
        "type": "AI",
        "updatedAt": "2022-07-22T15:54:48.785Z"
    },
    {
        "createdAt": "2022-07-22T15:54:44.062Z",
        "numberOfFiles": "26",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Kitchen",
        "count": "26",
        "id": "a073cf0e-8f64-4610-bf57-a44af51bcd61",
        "type": "AI",
        "updatedAt": "2022-07-22T15:54:44.062Z"
    },
    {
        "createdAt": "2022-07-22T16:15:16.993Z",
        "numberOfFiles": "26",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Trademark",
        "count": "26",
        "id": "54b61ce2-3a75-4dd7-ba80-3abecc6b203f",
        "type": "AI",
        "updatedAt": "2022-07-22T16:15:16.993Z"
    },
    {
        "createdAt": "2023-01-23T19:35:00.484Z",
        "numberOfFiles": "26",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Chair",
        "count": "26",
        "id": "8abea210-c658-4ee7-9818-eca0435c15a6",
        "type": "AI",
        "updatedAt": "2023-01-23T19:35:00.484Z"
    },
    {
        "createdAt": "2023-06-22T12:42:50.368Z",
        "numberOfFiles": "26",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Table",
        "count": "26",
        "id": "bd65f6c4-4435-4cbe-a729-aa75e98229d0",
        "type": "AI",
        "updatedAt": "2023-06-22T12:42:50.368Z"
    },
    {
        "createdAt": "2022-07-22T15:54:48.787Z",
        "numberOfFiles": "25",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "House",
        "count": "25",
        "id": "258f1238-71ab-44d0-80de-916f861e6a40",
        "type": "AI",
        "updatedAt": "2022-07-22T15:54:48.787Z"
    },
    {
        "createdAt": "2022-08-01T15:43:05.189Z",
        "numberOfFiles": "25",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sea",
        "count": "25",
        "id": "36169fe3-ac62-49f1-9a4f-32804364fc3d",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:05.189Z"
    },
    {
        "createdAt": "2022-08-01T15:43:56.961Z",
        "numberOfFiles": "25",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Beverage",
        "count": "25",
        "id": "ff8e84aa-5c8d-4966-ad63-ccb5d0486655",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:56.961Z"
    },
    {
        "createdAt": "2022-08-09T21:07:50.944Z",
        "numberOfFiles": "25",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Footwear",
        "count": "25",
        "id": "864996b0-902c-4925-aa4e-f2d043483d32",
        "type": "AI",
        "updatedAt": "2022-08-09T21:07:50.944Z"
    },
    {
        "createdAt": "2023-01-23T19:34:59.629Z",
        "numberOfFiles": "25",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sky",
        "count": "25",
        "id": "2b6f84b3-a18f-42f4-9961-e2af9d0947fd",
        "type": "AI",
        "updatedAt": "2023-01-23T19:34:59.629Z"
    },
    {
        "createdAt": "2022-07-22T15:54:41.441Z",
        "numberOfFiles": "24",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Bedroom",
        "count": "24",
        "id": "f5f62ba5-8f9a-40bd-bc65-d1c5fdbd0400",
        "type": "AI",
        "updatedAt": "2022-07-22T15:54:41.441Z"
    },
    {
        "createdAt": "2023-07-08T03:16:09.732Z",
        "numberOfFiles": "24",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Hangar",
        "count": "24",
        "id": "960d1f01-a75e-407e-8925-8b1328f7e88f",
        "type": "AI",
        "updatedAt": "2023-07-08T03:16:09.732Z"
    },
    {
        "createdAt": "2023-01-23T19:35:03.834Z",
        "numberOfFiles": "23",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Ketchup",
        "count": "23",
        "id": "aabb4ee0-dad5-4642-b732-eac25714c066",
        "type": "AI",
        "updatedAt": "2023-01-23T19:35:03.834Z"
    },
    {
        "createdAt": "2022-07-22T15:54:41.441Z",
        "numberOfFiles": "22",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Wood",
        "count": "22",
        "id": "6a5a2275-e1aa-4e49-9ae4-cf7d42746a2c",
        "type": "AI",
        "updatedAt": "2022-07-22T15:54:41.441Z"
    },
    {
        "createdAt": "2023-02-09T14:50:53.546Z",
        "numberOfFiles": "22",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Formal Wear",
        "count": "22",
        "id": "b730b6f2-3d67-4bc4-9788-e2608fc52e9b",
        "type": "AI",
        "updatedAt": "2023-02-09T14:50:53.546Z"
    },
    {
        "createdAt": "2023-06-26T12:33:18.978Z",
        "numberOfFiles": "22",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Ammunition",
        "count": "22",
        "id": "ea5eee6a-f296-4f53-a6db-df2ec61ee27b",
        "type": "AI",
        "updatedAt": "2023-06-26T12:33:18.978Z"
    },
    {
        "createdAt": "2023-06-28T08:21:28.554Z",
        "numberOfFiles": "22",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Computer Keyboard",
        "count": "22",
        "id": "9c72bb43-effd-456d-a352-7106081f61e4",
        "type": "AI",
        "updatedAt": "2023-06-28T08:21:28.554Z"
    },
    {
        "createdAt": "2023-06-29T07:05:42.342Z",
        "numberOfFiles": "22",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "First Aid",
        "count": "22",
        "id": "31ed839e-7e19-49dc-9edc-6145e6f6dfe1",
        "type": "AI",
        "updatedAt": "2023-06-29T07:05:42.342Z"
    },
    {
        "createdAt": "2022-11-07T14:11:13.714Z",
        "numberOfFiles": "21",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Body Part",
        "count": "21",
        "id": "bc6e2ec0-e31e-4ce7-9eae-5f337eda3273",
        "type": "AI",
        "updatedAt": "2022-11-07T14:11:13.714Z"
    },
    {
        "createdAt": "2023-01-30T15:28:33.039Z",
        "numberOfFiles": "21",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Boy",
        "count": "21",
        "id": "b0a4e1b2-ac92-41c6-8016-1187e0296e33",
        "type": "AI",
        "updatedAt": "2023-01-30T15:28:33.039Z"
    },
    {
        "createdAt": "2023-02-09T14:50:59.320Z",
        "numberOfFiles": "21",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Baby",
        "count": "21",
        "id": "080e263a-3f8b-40cb-b712-fbf5c6c40b5b",
        "type": "AI",
        "updatedAt": "2023-02-09T14:50:59.320Z"
    },
    {
        "createdAt": "2023-03-22T09:50:29.986Z",
        "numberOfFiles": "21",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "People",
        "count": "21",
        "id": "2b8709fc-f2f7-4b1a-908b-683c69a62f1f",
        "type": "AI",
        "updatedAt": "2023-03-22T09:50:29.986Z"
    },
    {
        "createdAt": "2022-07-22T15:54:48.792Z",
        "numberOfFiles": "20",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Villa",
        "count": "20",
        "id": "309e51bf-a684-47f9-997e-8aa433da33f0",
        "type": "AI",
        "updatedAt": "2022-07-22T15:54:48.792Z"
    },
    {
        "createdAt": "2022-07-22T15:57:00.733Z",
        "numberOfFiles": "20",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Art",
        "count": "20",
        "id": "472dfd2c-8783-476a-9d79-04386a50c24e",
        "type": "AI",
        "updatedAt": "2022-07-22T15:57:00.733Z"
    },
    {
        "createdAt": "2022-08-09T21:11:50.240Z",
        "numberOfFiles": "20",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Shoreline",
        "count": "20",
        "id": "cf0a7b2c-3d7a-4695-9725-6a20e0977aa5",
        "type": "AI",
        "updatedAt": "2022-08-09T21:11:50.240Z"
    },
    {
        "createdAt": "2022-08-09T21:13:43.722Z",
        "numberOfFiles": "20",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Pants",
        "count": "20",
        "id": "cb80485a-7f63-421a-b943-089690129d2d",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:43.722Z"
    },
    {
        "createdAt": "2023-02-09T14:50:53.547Z",
        "numberOfFiles": "20",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Glasses",
        "count": "20",
        "id": "d9c61b02-5d00-42d2-b04b-e23e8121ecf3",
        "type": "AI",
        "updatedAt": "2023-02-09T14:50:53.547Z"
    },
    {
        "createdAt": "2023-02-09T14:51:07.638Z",
        "numberOfFiles": "20",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Happy",
        "count": "20",
        "id": "379d03a8-67aa-4a90-bb2b-50e9ddd4327a",
        "type": "AI",
        "updatedAt": "2023-02-09T14:51:07.638Z"
    },
    {
        "createdAt": "2023-06-28T04:44:13.342Z",
        "numberOfFiles": "20",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Arrow",
        "count": "20",
        "id": "bb927ca6-f999-40dd-8419-71889ed8d80d",
        "type": "AI",
        "updatedAt": "2023-06-28T04:44:13.342Z"
    },
    {
        "createdAt": "2022-07-22T15:54:48.786Z",
        "numberOfFiles": "19",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Door",
        "count": "19",
        "id": "f1495ef5-d48e-4ba6-abe6-9f0c1e9ed3ce",
        "type": "AI",
        "updatedAt": "2022-07-22T15:54:48.786Z"
    },
    {
        "createdAt": "2022-08-09T21:11:50.240Z",
        "numberOfFiles": "19",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Land",
        "count": "19",
        "id": "07c4d002-18ad-46ef-92bc-7ba8cc8eb844",
        "type": "AI",
        "updatedAt": "2022-08-09T21:11:50.240Z"
    },
    {
        "createdAt": "2023-01-23T19:35:00.484Z",
        "numberOfFiles": "19",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Lamp",
        "count": "19",
        "id": "5bd716c2-ac03-4890-9775-b294af812f13",
        "type": "AI",
        "updatedAt": "2023-01-23T19:35:00.484Z"
    },
    {
        "createdAt": "2023-06-26T12:33:16.658Z",
        "numberOfFiles": "19",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Handbag",
        "count": "19",
        "id": "dc4a22a3-4a77-4416-844a-6b49fd408c3b",
        "type": "AI",
        "updatedAt": "2023-06-26T12:33:16.658Z"
    },
    {
        "createdAt": "2023-06-29T07:52:26.294Z",
        "numberOfFiles": "19",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cross",
        "count": "19",
        "id": "fbc7b1b3-cfb2-4e87-9cea-439fc5a2ab35",
        "type": "AI",
        "updatedAt": "2023-06-29T07:52:26.294Z"
    },
    {
        "createdAt": "2023-06-29T09:10:24.874Z",
        "numberOfFiles": "19",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Arrowhead",
        "count": "19",
        "id": "d0577bed-ea58-4fd3-b859-21f2f22fe559",
        "type": "AI",
        "updatedAt": "2023-06-29T09:10:24.874Z"
    },
    {
        "createdAt": "2023-06-29T09:11:20.282Z",
        "numberOfFiles": "19",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Recycling Symbol",
        "count": "19",
        "id": "ee1408c0-8795-4111-b3e4-256bb0901260",
        "type": "AI",
        "updatedAt": "2023-06-29T09:11:20.282Z"
    },
    {
        "createdAt": "2022-07-19T20:22:14.173Z",
        "numberOfFiles": "18",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Vehicle",
        "count": "18",
        "id": "6b56c5df-03e4-4e1e-9cfc-1c0d3ba62d41",
        "type": "AI",
        "updatedAt": "2022-07-19T20:22:14.173Z"
    },
    {
        "createdAt": "2022-07-22T15:54:41.442Z",
        "numberOfFiles": "18",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Hardwood",
        "count": "18",
        "id": "d9911f21-b09c-4459-a4e0-0b4a1ea80db2",
        "type": "AI",
        "updatedAt": "2022-07-22T15:54:41.442Z"
    },
    {
        "createdAt": "2023-01-23T19:34:53.531Z",
        "numberOfFiles": "18",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Dynamite",
        "count": "18",
        "id": "5443116d-2866-49e6-874a-3b5ffec40551",
        "type": "AI",
        "updatedAt": "2023-01-23T19:34:53.531Z"
    },
    {
        "createdAt": "2023-02-03T20:26:28.657Z",
        "numberOfFiles": "18",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Worker",
        "count": "18",
        "id": "7ff6cfab-7e66-48ff-81f6-5a3169114ce9",
        "type": "AI",
        "updatedAt": "2023-02-03T20:26:28.657Z"
    },
    {
        "createdAt": "2023-04-14T02:13:31.199Z",
        "numberOfFiles": "18",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Diagram",
        "count": "18",
        "id": "175b6d20-635b-4be9-9736-daacf0c82b55",
        "type": "AI",
        "updatedAt": "2023-04-14T02:13:31.199Z"
    },
    {
        "createdAt": "2022-07-22T15:54:41.441Z",
        "numberOfFiles": "17",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Flooring",
        "count": "17",
        "id": "26b8a52e-4911-4454-9fa5-995dcc93c7e9",
        "type": "AI",
        "updatedAt": "2022-07-22T15:54:41.441Z"
    },
    {
        "createdAt": "2022-11-11T21:10:17.557Z",
        "numberOfFiles": "17",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Disk",
        "count": "17",
        "id": "4beaaafc-b42e-4e33-88e0-430f725c47fa",
        "type": "AI",
        "updatedAt": "2022-11-11T21:10:17.557Z"
    },
    {
        "createdAt": "2023-06-09T08:41:08.796Z",
        "numberOfFiles": "17",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Hat",
        "count": "17",
        "id": "930f0c77-3c21-4c0c-9d5f-8ee762c8b196",
        "type": "AI",
        "updatedAt": "2023-06-09T08:41:08.796Z"
    },
    {
        "createdAt": "2022-07-22T15:57:00.733Z",
        "numberOfFiles": "16",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Graphics",
        "count": "16",
        "id": "e619494d-9347-4da6-8456-9ee6c73da169",
        "type": "AI",
        "updatedAt": "2022-07-22T15:57:00.733Z"
    },
    {
        "createdAt": "2022-07-26T11:20:30.255Z",
        "numberOfFiles": "16",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Bottle",
        "count": "16",
        "id": "0eb97849-f090-45e9-83ce-8ce9cc29d3c7",
        "type": "AI",
        "updatedAt": "2022-07-26T11:20:30.255Z"
    },
    {
        "createdAt": "2022-10-25T13:13:07.445Z",
        "numberOfFiles": "16",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Finger",
        "count": "16",
        "id": "4288fb3d-eab9-458d-96e1-362fde039eda",
        "type": "AI",
        "updatedAt": "2022-10-25T13:13:07.445Z"
    },
    {
        "createdAt": "2022-08-09T21:13:34.795Z",
        "numberOfFiles": "15",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Tree",
        "count": "15",
        "id": "9ddd958c-edfb-4e5e-9844-c6692e793a37",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:34.795Z"
    },
    {
        "createdAt": "2023-01-03T21:31:33.757Z",
        "numberOfFiles": "15",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Glove",
        "count": "15",
        "id": "e8d5b3eb-9729-4180-a351-2596f6f16210",
        "type": "AI",
        "updatedAt": "2023-01-03T21:31:33.757Z"
    },
    {
        "createdAt": "2023-01-30T15:28:33.039Z",
        "numberOfFiles": "15",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Child",
        "count": "15",
        "id": "b4540939-18a7-43ab-a61f-533bc3b24848",
        "type": "AI",
        "updatedAt": "2023-01-30T15:28:33.039Z"
    },
    {
        "createdAt": "2023-02-03T22:26:12.891Z",
        "numberOfFiles": "15",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Helmet",
        "count": "15",
        "id": "04831d86-db20-4bda-9038-4b5dc2f9e1b2",
        "type": "AI",
        "updatedAt": "2023-02-03T22:26:12.891Z"
    },
    {
        "createdAt": "2023-02-09T14:50:59.319Z",
        "numberOfFiles": "15",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Alcohol",
        "count": "15",
        "id": "0f9b814e-a9c3-4283-9770-4f1c324fb788",
        "type": "AI",
        "updatedAt": "2023-02-09T14:50:59.319Z"
    },
    {
        "createdAt": "2023-02-09T14:51:18.383Z",
        "numberOfFiles": "15",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Backpack",
        "count": "15",
        "id": "4cbc2eae-a675-469a-97d1-afd3dc35ab88",
        "type": "AI",
        "updatedAt": "2023-02-09T14:51:18.383Z"
    },
    {
        "createdAt": "2023-03-06T16:57:49.377Z",
        "numberOfFiles": "15",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Tie",
        "count": "15",
        "id": "a55019ef-d751-4a8c-8a1e-0b262765ac27",
        "type": "AI",
        "updatedAt": "2023-03-06T16:57:49.377Z"
    },
    {
        "createdAt": "2023-05-31T11:57:36.895Z",
        "numberOfFiles": "15",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Home Decor",
        "count": "15",
        "id": "32422d47-3117-4c36-99c0-89c277a70b96",
        "type": "AI",
        "updatedAt": "2023-05-31T11:57:36.895Z"
    },
    {
        "createdAt": "2023-06-22T14:03:35.578Z",
        "numberOfFiles": "15",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Spiral",
        "count": "15",
        "id": "6972eb1f-c7f3-4d78-ae16-8480368541ec",
        "type": "AI",
        "updatedAt": "2023-06-22T14:03:35.578Z"
    },
    {
        "createdAt": "2023-06-23T13:37:42.150Z",
        "numberOfFiles": "15",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Suit",
        "count": "15",
        "id": "0fa647f2-bb08-40bd-8e5a-526e839405de",
        "type": "AI",
        "updatedAt": "2023-06-23T13:37:42.150Z"
    },
    {
        "createdAt": "2023-06-28T11:56:59.706Z",
        "numberOfFiles": "15",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Shirt",
        "count": "15",
        "id": "b87438d5-dd18-4a4f-9cec-39924ad63fc1",
        "type": "AI",
        "updatedAt": "2023-06-28T11:56:59.706Z"
    },
    {
        "createdAt": "2023-06-29T07:05:21.826Z",
        "numberOfFiles": "15",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cutlery",
        "count": "15",
        "id": "c0ed1ac1-d8b2-442c-9376-4ecb3bf7a7ed",
        "type": "AI",
        "updatedAt": "2023-06-29T07:05:21.826Z"
    },
    {
        "createdAt": "2022-07-22T15:54:48.789Z",
        "numberOfFiles": "14",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Flagstone",
        "count": "14",
        "id": "81e8581b-ba7d-45aa-b13e-fb84754b92d9",
        "type": "AI",
        "updatedAt": "2022-07-22T15:54:48.789Z"
    },
    {
        "createdAt": "2022-07-22T15:54:48.790Z",
        "numberOfFiles": "14",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cottage",
        "count": "14",
        "id": "dd55aac5-f040-4fac-b692-e96525c4e4f7",
        "type": "AI",
        "updatedAt": "2022-07-22T15:54:48.790Z"
    },
    {
        "createdAt": "2022-07-22T15:54:48.791Z",
        "numberOfFiles": "14",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Walkway",
        "count": "14",
        "id": "97af1f59-9c4b-4849-8d02-cab9e45dd8cb",
        "type": "AI",
        "updatedAt": "2022-07-22T15:54:48.791Z"
    },
    {
        "createdAt": "2022-07-22T15:57:00.734Z",
        "numberOfFiles": "14",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Pattern",
        "count": "14",
        "id": "437cb349-b095-407d-9d35-46a12dcc8904",
        "type": "AI",
        "updatedAt": "2022-07-22T15:57:00.734Z"
    },
    {
        "createdAt": "2023-01-23T19:34:55.549Z",
        "numberOfFiles": "14",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Astronomy",
        "count": "14",
        "id": "516c0376-2872-4034-af5f-e1902e8697f0",
        "type": "AI",
        "updatedAt": "2023-01-23T19:34:55.549Z"
    },
    {
        "createdAt": "2023-01-23T19:34:59.630Z",
        "numberOfFiles": "14",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Light",
        "count": "14",
        "id": "c75c7ba9-1b4f-44e7-82ef-f9d884871149",
        "type": "AI",
        "updatedAt": "2023-01-23T19:34:59.630Z"
    },
    {
        "createdAt": "2023-06-28T08:16:58.718Z",
        "numberOfFiles": "14",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Teen",
        "count": "14",
        "id": "83c60404-3154-494d-9348-fbf8004e03bc",
        "type": "AI",
        "updatedAt": "2023-06-28T08:16:58.718Z"
    },
    {
        "createdAt": "2023-06-28T10:20:51.133Z",
        "numberOfFiles": "14",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Mailbox",
        "count": "14",
        "id": "047e1f7e-8256-4e7e-bdba-5b1c8323db66",
        "type": "AI",
        "updatedAt": "2023-06-28T10:20:51.133Z"
    },
    {
        "createdAt": "2022-07-22T15:54:39.005Z",
        "numberOfFiles": "13",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Bathroom",
        "count": "13",
        "id": "50d92e6f-3016-4be1-a42e-dda5855cc053",
        "type": "AI",
        "updatedAt": "2022-07-22T15:54:39.005Z"
    },
    {
        "createdAt": "2022-07-22T15:54:41.442Z",
        "numberOfFiles": "13",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Corner",
        "count": "13",
        "id": "047868f0-c5ad-4514-9607-264ca7280add",
        "type": "AI",
        "updatedAt": "2022-07-22T15:54:41.442Z"
    },
    {
        "createdAt": "2022-07-22T15:54:44.063Z",
        "numberOfFiles": "13",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Kitchen Island",
        "count": "13",
        "id": "9cf04dbd-b84b-4862-b060-ac862f65176d",
        "type": "AI",
        "updatedAt": "2022-07-22T15:54:44.063Z"
    },
    {
        "createdAt": "2023-02-09T14:51:00.633Z",
        "numberOfFiles": "13",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Tequila",
        "count": "13",
        "id": "e9b210cb-7f59-4c12-a442-2eeccedc8c61",
        "type": "AI",
        "updatedAt": "2023-02-09T14:51:00.633Z"
    },
    {
        "createdAt": "2023-02-09T14:51:01.389Z",
        "numberOfFiles": "13",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Jacket",
        "count": "13",
        "id": "40cdd7b1-c686-444b-8d14-18dd933c68eb",
        "type": "AI",
        "updatedAt": "2023-02-09T14:51:01.389Z"
    },
    {
        "createdAt": "2022-08-01T15:43:04.257Z",
        "numberOfFiles": "12",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Promontory",
        "count": "12",
        "id": "6453e14f-fc08-4dc9-be90-d22693011872",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:04.257Z"
    },
    {
        "createdAt": "2022-08-01T15:43:57.451Z",
        "numberOfFiles": "12",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Fruit",
        "count": "12",
        "id": "c6d0265b-891c-4835-9561-dde67f71a2a4",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:57.451Z"
    },
    {
        "createdAt": "2022-11-07T14:11:13.714Z",
        "numberOfFiles": "12",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Hand",
        "count": "12",
        "id": "0c4902d6-f625-48e9-a3c1-97b790f39211",
        "type": "AI",
        "updatedAt": "2022-11-07T14:11:13.714Z"
    },
    {
        "createdAt": "2023-04-11T07:19:31.739Z",
        "numberOfFiles": "12",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Girl",
        "count": "12",
        "id": "126b0b50-15dc-4479-a980-88229aebff06",
        "type": "AI",
        "updatedAt": "2023-04-11T07:19:31.739Z"
    },
    {
        "createdAt": "2023-06-26T12:33:16.659Z",
        "numberOfFiles": "12",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Briefcase",
        "count": "12",
        "id": "92f81db1-6a4b-4ed0-a9b1-beccb026ef9e",
        "type": "AI",
        "updatedAt": "2023-06-26T12:33:16.659Z"
    },
    {
        "createdAt": "2023-06-29T07:43:27.858Z",
        "numberOfFiles": "12",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Magnifying",
        "count": "12",
        "id": "f7baf9da-e60a-4393-bd01-ba79241904d9",
        "type": "AI",
        "updatedAt": "2023-06-29T07:43:27.858Z"
    },
    {
        "createdAt": "2022-07-27T21:43:27.539Z",
        "numberOfFiles": "11",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Plot",
        "count": "11",
        "id": "f3c95f21-9202-45e8-a75b-6b99a21c84b2",
        "type": "AI",
        "updatedAt": "2022-07-27T21:43:27.539Z"
    },
    {
        "createdAt": "2022-08-09T21:11:50.240Z",
        "numberOfFiles": "11",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Coast",
        "count": "11",
        "id": "a1bad5f9-e5ab-4c53-b67d-4286dca65350",
        "type": "AI",
        "updatedAt": "2022-08-09T21:11:50.240Z"
    },
    {
        "createdAt": "2022-08-09T21:13:23.820Z",
        "numberOfFiles": "11",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Car",
        "count": "11",
        "id": "085c36d0-845b-4b90-b1e4-38bff0234f9f",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:23.820Z"
    },
    {
        "createdAt": "2023-01-19T17:36:43.467Z",
        "numberOfFiles": "11",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Bulldozer",
        "count": "11",
        "id": "148a69da-c9ce-4fb9-8764-5307088e2080",
        "type": "AI",
        "updatedAt": "2023-01-19T17:36:43.467Z"
    },
    {
        "createdAt": "2023-06-29T07:44:06.718Z",
        "numberOfFiles": "11",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Musical Instrument",
        "count": "11",
        "id": "bcb2f600-1708-452a-afbf-d4301ac059e1",
        "type": "AI",
        "updatedAt": "2023-06-29T07:44:06.718Z"
    },
    {
        "createdAt": "2023-06-29T07:44:06.722Z",
        "numberOfFiles": "11",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Guitar",
        "count": "11",
        "id": "e684f1f8-70a0-4b20-845c-3c267b74c52c",
        "type": "AI",
        "updatedAt": "2023-06-29T07:44:06.722Z"
    },
    {
        "createdAt": "2023-07-03T08:01:03.198Z",
        "numberOfFiles": "11",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Silhouette",
        "count": "11",
        "id": "765216b2-cdfb-471f-ba50-3a4774cf0a73",
        "type": "AI",
        "updatedAt": "2023-07-03T08:01:03.198Z"
    },
    {
        "createdAt": "2022-07-22T16:15:20.232Z",
        "numberOfFiles": "10",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Word",
        "count": "10",
        "id": "00f02114-8f3d-498e-9a2f-d6b5e50c128f",
        "type": "AI",
        "updatedAt": "2022-07-22T16:15:20.232Z"
    },
    {
        "createdAt": "2022-08-01T15:43:05.189Z",
        "numberOfFiles": "10",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Animal",
        "count": "10",
        "id": "b0018dfd-d3fd-4256-83ce-51c65075443c",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:05.189Z"
    },
    {
        "createdAt": "2022-08-01T15:43:06.296Z",
        "numberOfFiles": "10",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Waterfront",
        "count": "10",
        "id": "47f9e1e9-11bf-45c7-b4c2-069baf39b844",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:06.296Z"
    },
    {
        "createdAt": "2022-08-09T21:07:47.532Z",
        "numberOfFiles": "10",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sitting",
        "count": "10",
        "id": "1a928c5e-e8d1-406f-bab0-e188155f8bae",
        "type": "AI",
        "updatedAt": "2022-08-09T21:07:47.532Z"
    },
    {
        "createdAt": "2022-08-09T21:13:34.795Z",
        "numberOfFiles": "10",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Landscape",
        "count": "10",
        "id": "a79104d6-10f2-47f1-b981-411ec3011ca8",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:34.795Z"
    },
    {
        "createdAt": "2022-08-09T21:13:53.654Z",
        "numberOfFiles": "10",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Grassland",
        "count": "10",
        "id": "98774f74-71bc-4dec-97b4-d625bf013f82",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:53.654Z"
    },
    {
        "createdAt": "2023-01-16T13:25:22.445Z",
        "numberOfFiles": "10",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Drilling Rig",
        "count": "10",
        "id": "b0ce826d-b375-440d-aa64-f618c0e57cd0",
        "type": "AI",
        "updatedAt": "2023-01-16T13:25:22.445Z"
    },
    {
        "createdAt": "2023-01-23T19:35:03.833Z",
        "numberOfFiles": "10",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Purple",
        "count": "10",
        "id": "112b04e2-084f-402e-abe7-504bfb8b984d",
        "type": "AI",
        "updatedAt": "2023-01-23T19:35:03.833Z"
    },
    {
        "createdAt": "2023-02-03T22:26:05.137Z",
        "numberOfFiles": "10",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Construction",
        "count": "10",
        "id": "bc37674b-c779-4d76-af53-947aac0b14dc",
        "type": "AI",
        "updatedAt": "2023-02-03T22:26:05.137Z"
    },
    {
        "createdAt": "2023-02-09T14:51:01.389Z",
        "numberOfFiles": "10",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sneaker",
        "count": "10",
        "id": "3e4fc629-0d8a-40f3-beac-d98c5624d061",
        "type": "AI",
        "updatedAt": "2023-02-09T14:51:01.389Z"
    },
    {
        "createdAt": "2023-02-25T17:03:01.026Z",
        "numberOfFiles": "10",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Walking",
        "count": "10",
        "id": "4384868d-c35e-43cf-91e5-b093a61c1cfa",
        "type": "AI",
        "updatedAt": "2023-02-25T17:03:01.026Z"
    },
    {
        "createdAt": "2023-06-09T08:41:08.796Z",
        "numberOfFiles": "10",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cap",
        "count": "10",
        "id": "2ce4cf14-b872-4620-81f0-05302c8c01f5",
        "type": "AI",
        "updatedAt": "2023-06-09T08:41:08.796Z"
    },
    {
        "createdAt": "2022-07-19T20:22:14.174Z",
        "numberOfFiles": "9",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Transportation",
        "count": "9",
        "id": "068bc026-9300-41bf-9ccd-48ebd6330ecb",
        "type": "AI",
        "updatedAt": "2022-07-19T20:22:14.174Z"
    },
    {
        "createdAt": "2022-08-01T15:43:04.257Z",
        "numberOfFiles": "9",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Boat",
        "count": "9",
        "id": "254b7a11-76a6-460a-b243-2d03ad73aa64",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:04.257Z"
    },
    {
        "createdAt": "2022-08-01T15:43:56.961Z",
        "numberOfFiles": "9",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Milk",
        "count": "9",
        "id": "46aed065-bd4d-4719-ba8d-1d78bfee619a",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:56.961Z"
    },
    {
        "createdAt": "2022-08-09T21:07:50.944Z",
        "numberOfFiles": "9",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Dog",
        "count": "9",
        "id": "6c0f1047-b3b2-4d12-9910-68c45298c805",
        "type": "AI",
        "updatedAt": "2022-08-09T21:07:50.944Z"
    },
    {
        "createdAt": "2023-02-09T14:50:59.319Z",
        "numberOfFiles": "9",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Liquor",
        "count": "9",
        "id": "9f426509-6c19-49c3-8fbe-371036d9dc41",
        "type": "AI",
        "updatedAt": "2023-02-09T14:50:59.319Z"
    },
    {
        "createdAt": "2023-02-09T14:51:19.753Z",
        "numberOfFiles": "9",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cosmetics",
        "count": "9",
        "id": "10ac3a13-d7da-49f3-a557-b9db9c011466",
        "type": "AI",
        "updatedAt": "2023-02-09T14:51:19.753Z"
    },
    {
        "createdAt": "2023-03-23T21:41:18.897Z",
        "numberOfFiles": "9",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Painting",
        "count": "9",
        "id": "7c6e7370-260a-4797-b58f-f175c5b66f42",
        "type": "AI",
        "updatedAt": "2023-03-23T21:41:18.897Z"
    },
    {
        "createdAt": "2023-06-28T04:44:04.990Z",
        "numberOfFiles": "9",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Baseball Cap",
        "count": "9",
        "id": "c82b3dec-c56f-4932-a3c9-285e4806073f",
        "type": "AI",
        "updatedAt": "2023-06-28T04:44:04.990Z"
    },
    {
        "createdAt": "2023-06-28T08:16:58.722Z",
        "numberOfFiles": "9",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Wristwatch",
        "count": "9",
        "id": "d1a5def4-1ff6-44c0-b09f-da8a70fe18c4",
        "type": "AI",
        "updatedAt": "2023-06-28T08:16:58.722Z"
    },
    {
        "createdAt": "2023-06-29T09:10:34.170Z",
        "numberOfFiles": "9",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Hook",
        "count": "9",
        "id": "86aaf639-10a1-44ba-bf15-69f0c3e3ff68",
        "type": "AI",
        "updatedAt": "2023-06-29T09:10:34.170Z"
    },
    {
        "createdAt": "2023-06-29T09:25:58.566Z",
        "numberOfFiles": "9",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Plectrum",
        "count": "9",
        "id": "3b9df95a-0081-46e3-80dd-1fb6228eeefe",
        "type": "AI",
        "updatedAt": "2023-06-29T09:25:58.566Z"
    },
    {
        "createdAt": "2023-07-08T05:20:55.592Z",
        "numberOfFiles": "9",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Camera",
        "count": "9",
        "id": "7b166bc4-9b86-4600-8eee-57a2d17d1266",
        "type": "AI",
        "updatedAt": "2023-07-08T05:20:55.592Z"
    },
    {
        "createdAt": "2023-07-08T05:20:55.593Z",
        "numberOfFiles": "9",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Photographer",
        "count": "9",
        "id": "560eaaa5-fa6d-4e03-828b-1b30af43a4db",
        "type": "AI",
        "updatedAt": "2023-07-08T05:20:55.593Z"
    },
    {
        "createdAt": "2022-07-19T20:22:13.559Z",
        "numberOfFiles": "8",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Human",
        "count": "8",
        "id": "ef96b550-202b-4015-b2cd-35e0d7ce23a6",
        "type": "AI",
        "updatedAt": "2022-07-19T20:22:13.559Z"
    },
    {
        "createdAt": "2022-07-22T16:15:17.550Z",
        "numberOfFiles": "8",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Label",
        "count": "8",
        "id": "fea4377f-6a63-4391-ba7c-bf5473b7fe44",
        "type": "AI",
        "updatedAt": "2022-07-22T16:15:17.550Z"
    },
    {
        "createdAt": "2022-08-03T07:56:03.557Z",
        "numberOfFiles": "8",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Bird",
        "count": "8",
        "id": "8bc2fb74-5f9b-488c-8f98-19d45c26fda5",
        "type": "AI",
        "updatedAt": "2022-08-03T07:56:03.557Z"
    },
    {
        "createdAt": "2022-08-09T21:13:07.861Z",
        "numberOfFiles": "8",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sunglasses",
        "count": "8",
        "id": "9208d625-bdcb-4077-8962-f9a4abe2f733",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:07.861Z"
    },
    {
        "createdAt": "2022-11-11T17:01:10.692Z",
        "numberOfFiles": "8",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Smoke Pipe",
        "count": "8",
        "id": "273ec708-c192-4348-926f-9ec1a3f30b4a",
        "type": "AI",
        "updatedAt": "2022-11-11T17:01:10.692Z"
    },
    {
        "createdAt": "2022-12-28T14:42:26.865Z",
        "numberOfFiles": "8",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Blonde",
        "count": "8",
        "id": "10562b87-c482-4970-b1cb-3635e367dfd2",
        "type": "AI",
        "updatedAt": "2022-12-28T14:42:26.865Z"
    },
    {
        "createdAt": "2023-01-23T19:34:59.170Z",
        "numberOfFiles": "8",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Dimples",
        "count": "8",
        "id": "8d5b46e1-52f1-4464-a34d-0d37711071d2",
        "type": "AI",
        "updatedAt": "2023-01-23T19:34:59.170Z"
    },
    {
        "createdAt": "2023-02-09T14:50:52.960Z",
        "numberOfFiles": "8",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Peak",
        "count": "8",
        "id": "1b30d7a4-1d57-40cc-bb1d-029bd94bfb28",
        "type": "AI",
        "updatedAt": "2023-02-09T14:50:52.960Z"
    },
    {
        "createdAt": "2023-02-25T17:01:34.224Z",
        "numberOfFiles": "8",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Green",
        "count": "8",
        "id": "03d60b2e-0073-48ee-b9ac-37602789922a",
        "type": "AI",
        "updatedAt": "2023-02-25T17:01:34.224Z"
    },
    {
        "createdAt": "2023-04-14T02:13:29.716Z",
        "numberOfFiles": "8",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Chart",
        "count": "8",
        "id": "d32c301e-2ec7-45f6-9f6e-fae9144d6834",
        "type": "AI",
        "updatedAt": "2023-04-14T02:13:29.716Z"
    },
    {
        "createdAt": "2023-05-30T21:16:37.675Z",
        "numberOfFiles": "8",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Beer",
        "count": "8",
        "id": "0d5d519d-1681-47b1-b134-342e10ad65b9",
        "type": "AI",
        "updatedAt": "2023-05-30T21:16:37.675Z"
    },
    {
        "createdAt": "2023-06-22T14:03:35.578Z",
        "numberOfFiles": "8",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Ornament",
        "count": "8",
        "id": "70010cf1-c22e-486a-a063-1a2191a61cbd",
        "type": "AI",
        "updatedAt": "2023-06-22T14:03:35.578Z"
    },
    {
        "createdAt": "2023-06-29T05:27:19.399Z",
        "numberOfFiles": "8",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Heart",
        "count": "8",
        "id": "b0f163ff-362e-4e29-b3e1-4882b5c20a98",
        "type": "AI",
        "updatedAt": "2023-06-29T05:27:19.399Z"
    },
    {
        "createdAt": "2023-07-03T08:00:53.406Z",
        "numberOfFiles": "8",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cove",
        "count": "8",
        "id": "354c6eda-82fd-4431-bdbf-ced9625bb053",
        "type": "AI",
        "updatedAt": "2023-07-03T08:00:53.406Z"
    },
    {
        "createdAt": "2023-07-03T08:01:03.198Z",
        "numberOfFiles": "8",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Weather",
        "count": "8",
        "id": "bc89a360-b438-4899-b804-1053fc370ef5",
        "type": "AI",
        "updatedAt": "2023-07-03T08:01:03.198Z"
    },
    {
        "createdAt": "2023-07-08T05:19:19.342Z",
        "numberOfFiles": "8",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "UML Diagram",
        "count": "8",
        "id": "f207a5b6-ee66-44b1-8b1d-320bcedf9221",
        "type": "AI",
        "updatedAt": "2023-07-08T05:19:19.342Z"
    },
    {
        "createdAt": "2022-07-22T15:56:59.920Z",
        "numberOfFiles": "7",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Flower",
        "count": "7",
        "id": "315c1fa1-92e4-4919-9a3d-413c35dd61f2",
        "type": "AI",
        "updatedAt": "2022-07-22T15:56:59.920Z"
    },
    {
        "createdAt": "2022-08-01T15:43:06.295Z",
        "numberOfFiles": "7",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Mountain",
        "count": "7",
        "id": "765ea291-00df-4d38-b45f-a2695b87ab7b",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:06.295Z"
    },
    {
        "createdAt": "2022-08-01T15:46:11.700Z",
        "numberOfFiles": "7",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sphere",
        "count": "7",
        "id": "65b1f4ff-40de-467d-ae3e-b4fafe08b9d7",
        "type": "AI",
        "updatedAt": "2022-08-01T15:46:11.700Z"
    },
    {
        "createdAt": "2022-08-09T21:07:50.944Z",
        "numberOfFiles": "7",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Collage",
        "count": "7",
        "id": "bfd72dd8-f032-428a-846f-4eadb53e6ae5",
        "type": "AI",
        "updatedAt": "2022-08-09T21:07:50.944Z"
    },
    {
        "createdAt": "2022-09-08T16:13:58.425Z",
        "numberOfFiles": "7",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Toy",
        "count": "7",
        "id": "8f679902-4d8c-4993-bbda-7c1756ccd3a3",
        "type": "AI",
        "updatedAt": "2022-09-08T16:13:58.425Z"
    },
    {
        "createdAt": "2022-10-23T20:15:08.795Z",
        "numberOfFiles": "7",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Long Sleeve",
        "count": "7",
        "id": "aeaf83cc-4c01-4fe2-ae6f-b5ad5b062881",
        "type": "AI",
        "updatedAt": "2022-10-23T20:15:08.795Z"
    },
    {
        "createdAt": "2023-02-03T22:26:12.891Z",
        "numberOfFiles": "7",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Factory",
        "count": "7",
        "id": "122ba363-09d3-4d5b-9ea0-5b1d3405dba1",
        "type": "AI",
        "updatedAt": "2023-02-03T22:26:12.891Z"
    },
    {
        "createdAt": "2023-06-13T12:46:50.830Z",
        "numberOfFiles": "7",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Star Symbol",
        "count": "7",
        "id": "f57066ee-9483-4461-acd4-e1e81dfbf81e",
        "type": "AI",
        "updatedAt": "2023-06-13T12:46:50.830Z"
    },
    {
        "createdAt": "2023-07-08T05:19:30.666Z",
        "numberOfFiles": "7",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Box",
        "count": "7",
        "id": "647c0853-fa13-4e89-a5c7-6d58e65ebfce",
        "type": "AI",
        "updatedAt": "2023-07-08T05:19:30.666Z"
    },
    {
        "createdAt": "2022-07-22T15:57:00.734Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Floral Design",
        "count": "6",
        "id": "7c21d328-1bfe-4452-a480-2167361ba2f3",
        "type": "AI",
        "updatedAt": "2022-07-22T15:57:00.734Z"
    },
    {
        "createdAt": "2022-08-01T15:43:06.296Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Pier",
        "count": "6",
        "id": "bdf4bd34-2bc0-4996-aed5-2fa1ef51f442",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:06.296Z"
    },
    {
        "createdAt": "2022-08-01T15:43:56.961Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Juice",
        "count": "6",
        "id": "143223b9-0e7f-4922-9a91-d49ad3156aed",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:56.961Z"
    },
    {
        "createdAt": "2022-08-01T15:46:10.027Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Produce",
        "count": "6",
        "id": "89423648-f847-4801-bab0-10b66c4a5b5c",
        "type": "AI",
        "updatedAt": "2022-08-01T15:46:10.027Z"
    },
    {
        "createdAt": "2022-08-09T21:13:43.722Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Flare",
        "count": "6",
        "id": "39bc00df-8d9d-4266-a7a4-cb9258477548",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:43.722Z"
    },
    {
        "createdAt": "2022-08-09T21:13:53.654Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Field",
        "count": "6",
        "id": "a145b5e8-3dfe-42a7-8879-3df3d6c057fb",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:53.654Z"
    },
    {
        "createdAt": "2022-09-04T04:58:35.906Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Jeans",
        "count": "6",
        "id": "58173165-118d-43a0-ae31-9d18a38833fc",
        "type": "AI",
        "updatedAt": "2022-09-04T04:58:35.906Z"
    },
    {
        "createdAt": "2022-10-25T13:50:20.741Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Necklace",
        "count": "6",
        "id": "1a960f19-9f0c-418b-9211-c04d99d6b084",
        "type": "AI",
        "updatedAt": "2022-10-25T13:50:20.741Z"
    },
    {
        "createdAt": "2023-01-23T19:34:55.548Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Microphone",
        "count": "6",
        "id": "5f4fe855-50d9-4f18-9ae8-bc0c37a8d145",
        "type": "AI",
        "updatedAt": "2023-01-23T19:34:55.548Z"
    },
    {
        "createdAt": "2023-01-23T19:34:55.548Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Electrical Device",
        "count": "6",
        "id": "21d7239a-8fc4-4db6-818a-7675f7e07fdc",
        "type": "AI",
        "updatedAt": "2023-01-23T19:34:55.548Z"
    },
    {
        "createdAt": "2023-01-23T19:35:00.484Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Shelter",
        "count": "6",
        "id": "05275be4-61da-412a-876e-dbe25317d979",
        "type": "AI",
        "updatedAt": "2023-01-23T19:35:00.484Z"
    },
    {
        "createdAt": "2023-02-09T14:50:53.545Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Dress",
        "count": "6",
        "id": "37be8d1e-e12c-4fde-b5fe-3b898725881f",
        "type": "AI",
        "updatedAt": "2023-02-09T14:50:53.545Z"
    },
    {
        "createdAt": "2023-03-18T14:44:16.163Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "License Plate",
        "count": "6",
        "id": "3a5c49d8-b96b-43c7-b158-1f049e3a5f5d",
        "type": "AI",
        "updatedAt": "2023-03-18T14:44:16.163Z"
    },
    {
        "createdAt": "2023-03-23T21:42:08.968Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Truck",
        "count": "6",
        "id": "8340eb24-5faa-47b6-b588-c82d570ff57a",
        "type": "AI",
        "updatedAt": "2023-03-23T21:42:08.968Z"
    },
    {
        "createdAt": "2023-05-30T11:09:18.694Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Plate",
        "count": "6",
        "id": "1fc3d55b-9d34-4728-8883-76c27c2249bf",
        "type": "AI",
        "updatedAt": "2023-05-30T11:09:18.694Z"
    },
    {
        "createdAt": "2023-06-29T07:50:48.878Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Rifle",
        "count": "6",
        "id": "af21778d-ed02-4fd3-8b21-211f886b6de9",
        "type": "AI",
        "updatedAt": "2023-06-29T07:50:48.878Z"
    },
    {
        "createdAt": "2023-07-06T11:56:36.901Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Desk",
        "count": "6",
        "id": "640426e0-f47c-41b8-9c73-768152a2f04a",
        "type": "AI",
        "updatedAt": "2023-07-06T11:56:36.901Z"
    },
    {
        "createdAt": "2023-07-08T05:18:51.679Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Canine",
        "count": "6",
        "id": "a7748eba-26c6-46db-8ec8-51eb486e64d3",
        "type": "AI",
        "updatedAt": "2023-07-08T05:18:51.679Z"
    },
    {
        "createdAt": "2023-07-08T05:18:51.680Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Mammal",
        "count": "6",
        "id": "bae8dc44-6649-4963-8369-42dbb7e78afd",
        "type": "AI",
        "updatedAt": "2023-07-08T05:18:51.680Z"
    },
    {
        "createdAt": "2023-07-08T05:18:51.680Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Pet",
        "count": "6",
        "id": "ba1a6621-01fe-4e17-a5d9-2b46e88d1d45",
        "type": "AI",
        "updatedAt": "2023-07-08T05:18:51.680Z"
    },
    {
        "createdAt": "2023-07-08T05:19:11.973Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Publication",
        "count": "6",
        "id": "484e4087-a6d8-4664-be82-6cd383314fe5",
        "type": "AI",
        "updatedAt": "2023-07-08T05:19:11.973Z"
    },
    {
        "createdAt": "2023-07-08T05:19:41.122Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Text Message",
        "count": "6",
        "id": "5025c7d7-3704-42d3-b8ed-676bce581c52",
        "type": "AI",
        "updatedAt": "2023-07-08T05:19:41.122Z"
    },
    {
        "createdAt": "2022-07-19T20:22:13.559Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sport",
        "count": "5",
        "id": "b1bb4675-4bcc-48f7-a356-0f4191aae4c0",
        "type": "AI",
        "updatedAt": "2022-07-19T20:22:13.559Z"
    },
    {
        "createdAt": "2022-07-26T11:20:29.636Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Menu",
        "count": "5",
        "id": "3b6f7a38-a52f-4cd7-b28d-db9625b8c281",
        "type": "AI",
        "updatedAt": "2022-07-26T11:20:29.636Z"
    },
    {
        "createdAt": "2022-08-01T15:46:08.628Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Bread",
        "count": "5",
        "id": "90e806e8-3187-4bbf-96bf-54aff5816982",
        "type": "AI",
        "updatedAt": "2022-08-01T15:46:08.628Z"
    },
    {
        "createdAt": "2022-08-01T15:46:08.628Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Burger",
        "count": "5",
        "id": "1061e12c-9fea-4c87-8516-00387ed2dc49",
        "type": "AI",
        "updatedAt": "2022-08-01T15:46:08.628Z"
    },
    {
        "createdAt": "2022-08-01T15:46:10.028Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Citrus Fruit",
        "count": "5",
        "id": "c108d95d-88c4-4cd1-9ce5-f093b25b9f2a",
        "type": "AI",
        "updatedAt": "2022-08-01T15:46:10.028Z"
    },
    {
        "createdAt": "2022-08-01T15:46:16.235Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Fork",
        "count": "5",
        "id": "79f0d5e0-bcfb-4dd0-aed5-3eccc63f63bd",
        "type": "AI",
        "updatedAt": "2022-08-01T15:46:16.235Z"
    },
    {
        "createdAt": "2022-08-04T17:07:06.321Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "White",
        "count": "5",
        "id": "277633d3-dd51-45ce-967c-c05dbfa3aa6d",
        "type": "AI",
        "updatedAt": "2022-08-04T17:07:06.321Z"
    },
    {
        "createdAt": "2022-08-09T21:07:47.533Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Plywood",
        "count": "5",
        "id": "c317c86f-e740-4b12-8712-e7fb94a8c2c8",
        "type": "AI",
        "updatedAt": "2022-08-09T21:07:47.533Z"
    },
    {
        "createdAt": "2022-08-09T21:13:00.560Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Lunch",
        "count": "5",
        "id": "a030ee2c-bd8f-4c10-b650-e6f971ae05c1",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:00.560Z"
    },
    {
        "createdAt": "2022-08-09T21:13:14.756Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Potted Plant",
        "count": "5",
        "id": "1beb1100-0429-4002-b47f-3e410794ad01",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:14.756Z"
    },
    {
        "createdAt": "2022-08-09T21:13:23.821Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "City",
        "count": "5",
        "id": "9aa035bf-0b27-4e19-aad5-8d648fa140ba",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:23.821Z"
    },
    {
        "createdAt": "2022-10-23T20:15:08.794Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sleeve",
        "count": "5",
        "id": "b5389b0e-f297-463f-bdc6-08176660d798",
        "type": "AI",
        "updatedAt": "2022-10-23T20:15:08.794Z"
    },
    {
        "createdAt": "2023-02-03T22:27:30.719Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Fire Hydrant",
        "count": "5",
        "id": "42c825fc-27b5-4d13-a5b3-3c53276e5e56",
        "type": "AI",
        "updatedAt": "2023-02-03T22:27:30.719Z"
    },
    {
        "createdAt": "2023-04-14T02:13:31.199Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "White Board",
        "count": "5",
        "id": "01dc6f2f-ba99-4eac-b439-22725f52332f",
        "type": "AI",
        "updatedAt": "2023-04-14T02:13:31.199Z"
    },
    {
        "createdAt": "2023-06-22T20:09:23.833Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Construction Crane",
        "count": "5",
        "id": "7c5b3baa-1257-4dfa-a3a5-489ec54a3d33",
        "type": "AI",
        "updatedAt": "2023-06-22T20:09:23.833Z"
    },
    {
        "createdAt": "2023-06-22T20:37:02.024Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Invoice",
        "count": "5",
        "id": "c6e8b11f-e415-4d26-b545-98a2ad251dcf",
        "type": "AI",
        "updatedAt": "2023-06-22T20:37:02.024Z"
    },
    {
        "createdAt": "2023-06-22T20:37:02.025Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Document",
        "count": "5",
        "id": "ab3cf197-90e2-448f-8063-9b1eb7b0eb71",
        "type": "AI",
        "updatedAt": "2023-06-22T20:37:02.025Z"
    },
    {
        "createdAt": "2023-06-23T13:37:42.138Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Hair",
        "count": "5",
        "id": "62503b38-2f82-49c8-9836-75c0b96f998e",
        "type": "AI",
        "updatedAt": "2023-06-23T13:37:42.138Z"
    },
    {
        "createdAt": "2023-06-29T08:58:55.192Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Balloon",
        "count": "5",
        "id": "f799f99f-8071-42bb-9e66-d38d1a194531",
        "type": "AI",
        "updatedAt": "2023-06-29T08:58:55.192Z"
    },
    {
        "createdAt": "2023-07-08T05:20:30.078Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Shopping Cart",
        "count": "5",
        "id": "168b15a6-cad7-44d6-bbdc-49a8bc6346c6",
        "type": "AI",
        "updatedAt": "2023-07-08T05:20:30.078Z"
    },
    {
        "createdAt": "2022-07-22T15:57:03.352Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Jewelry",
        "count": "4",
        "id": "daed9b06-0d48-41da-a9d6-8a3214db4c46",
        "type": "AI",
        "updatedAt": "2022-07-22T15:57:03.352Z"
    },
    {
        "createdAt": "2022-07-22T16:15:20.232Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Alphabet",
        "count": "4",
        "id": "f2dcd5e4-7d43-4619-8987-e09d3d88e8f1",
        "type": "AI",
        "updatedAt": "2022-07-22T16:15:20.232Z"
    },
    {
        "createdAt": "2022-07-22T19:01:36.455Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Apparel",
        "count": "4",
        "id": "07fcfab8-59c4-40b8-bad8-036c7d600f4f",
        "type": "AI",
        "updatedAt": "2022-07-22T19:01:36.455Z"
    },
    {
        "createdAt": "2022-08-01T15:43:04.256Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Kayak",
        "count": "4",
        "id": "1584e88c-9c6b-4ec9-82d1-030e2cc025ec",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:04.256Z"
    },
    {
        "createdAt": "2022-08-01T15:43:04.256Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Rowboat",
        "count": "4",
        "id": "56ec59b9-f0a0-468c-9abf-d9fded3ae236",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:04.256Z"
    },
    {
        "createdAt": "2022-08-01T15:43:04.258Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Canoe",
        "count": "4",
        "id": "fbe32882-05f0-4dce-b14b-c72c72aca5f1",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:04.258Z"
    },
    {
        "createdAt": "2022-08-01T15:43:56.264Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Egg",
        "count": "4",
        "id": "0dba1c91-6668-420e-a292-bd607b7fc9c0",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:56.264Z"
    },
    {
        "createdAt": "2022-08-01T15:46:17.709Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Pizza",
        "count": "4",
        "id": "ae9c366d-5aa0-4d5c-bb76-bd52f104f95e",
        "type": "AI",
        "updatedAt": "2022-08-01T15:46:17.709Z"
    },
    {
        "createdAt": "2022-08-03T07:56:03.556Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "World Of Warcraft",
        "count": "4",
        "id": "2014be93-ff34-4948-b5cb-ef53bd6908d5",
        "type": "AI",
        "updatedAt": "2022-08-03T07:56:03.556Z"
    },
    {
        "createdAt": "2022-08-04T17:07:06.321Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Texture",
        "count": "4",
        "id": "dcb819d1-7931-4864-bf4c-df3b036ddc9f",
        "type": "AI",
        "updatedAt": "2022-08-04T17:07:06.321Z"
    },
    {
        "createdAt": "2022-08-09T13:27:24.331Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Crowd",
        "count": "4",
        "id": "4c032ff2-2f41-4754-9d98-6d35e58b2ff1",
        "type": "AI",
        "updatedAt": "2022-08-09T13:27:24.331Z"
    },
    {
        "createdAt": "2022-08-09T21:07:42.855Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Paper",
        "count": "4",
        "id": "3ffd9264-88db-4d08-b127-39fe172f258c",
        "type": "AI",
        "updatedAt": "2022-08-09T21:07:42.855Z"
    },
    {
        "createdAt": "2022-08-09T21:12:04.231Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Meal",
        "count": "4",
        "id": "b6ee15de-55f1-488e-b96f-25540885b4cb",
        "type": "AI",
        "updatedAt": "2022-08-09T21:12:04.231Z"
    },
    {
        "createdAt": "2022-08-09T21:12:26.958Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Beach",
        "count": "4",
        "id": "a0cc8fb8-cefd-4011-9207-4d6c8e7a5cc3",
        "type": "AI",
        "updatedAt": "2022-08-09T21:12:26.958Z"
    },
    {
        "createdAt": "2022-08-09T21:13:23.821Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Road",
        "count": "4",
        "id": "d0e680da-4b0f-47ec-aaca-5ca5210c0ea4",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:23.821Z"
    },
    {
        "createdAt": "2022-09-08T18:12:20.875Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Evening Dress",
        "count": "4",
        "id": "107364d1-7b85-4cfa-8e7c-b2d5f8eef227",
        "type": "AI",
        "updatedAt": "2022-09-08T18:12:20.875Z"
    },
    {
        "createdAt": "2023-01-23T19:35:00.485Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Wheel",
        "count": "4",
        "id": "f1411e58-3a45-426c-9e76-13f06c48a3f8",
        "type": "AI",
        "updatedAt": "2023-01-23T19:35:00.485Z"
    },
    {
        "createdAt": "2023-01-26T16:40:25.400Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Summer",
        "count": "4",
        "id": "515df2a9-7440-45d0-919c-f3c8855ec272",
        "type": "AI",
        "updatedAt": "2023-01-26T16:40:25.400Z"
    },
    {
        "createdAt": "2023-02-03T20:26:29.986Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Horizon",
        "count": "4",
        "id": "0096cb8a-000d-44bc-8202-ecaa06cb67b6",
        "type": "AI",
        "updatedAt": "2023-02-03T20:26:29.986Z"
    },
    {
        "createdAt": "2023-02-03T22:26:12.890Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Hardhat",
        "count": "4",
        "id": "06d56653-e222-4eda-a1a6-df75bf518274",
        "type": "AI",
        "updatedAt": "2023-02-03T22:26:12.890Z"
    },
    {
        "createdAt": "2023-02-09T14:50:59.319Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Perfume",
        "count": "4",
        "id": "4087e5b1-ff40-4fd5-bab8-06243d506f90",
        "type": "AI",
        "updatedAt": "2023-02-09T14:50:59.319Z"
    },
    {
        "createdAt": "2023-02-09T14:51:31.981Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cream",
        "count": "4",
        "id": "76df68e3-9584-4544-99cf-5b377ef6dd88",
        "type": "AI",
        "updatedAt": "2023-02-09T14:51:31.981Z"
    },
    {
        "createdAt": "2023-02-09T14:51:31.981Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Dessert",
        "count": "4",
        "id": "274ea186-ee51-48ed-97bc-bbd81061044d",
        "type": "AI",
        "updatedAt": "2023-02-09T14:51:31.981Z"
    },
    {
        "createdAt": "2023-02-14T13:28:16.652Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Manufacturing",
        "count": "4",
        "id": "f6386e17-1a10-471e-913f-d4025c69040b",
        "type": "AI",
        "updatedAt": "2023-02-14T13:28:16.652Z"
    },
    {
        "createdAt": "2023-03-23T21:41:18.895Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Living Room",
        "count": "4",
        "id": "5f4e9976-bdb2-4529-b770-663ff0596812",
        "type": "AI",
        "updatedAt": "2023-03-23T21:41:18.895Z"
    },
    {
        "createdAt": "2023-06-23T13:37:36.213Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Scoreboard",
        "count": "4",
        "id": "00d81498-f801-4840-a51e-d8044978f0ca",
        "type": "AI",
        "updatedAt": "2023-06-23T13:37:36.213Z"
    },
    {
        "createdAt": "2023-06-28T04:44:13.342Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cartoon",
        "count": "4",
        "id": "04374ecc-5e9c-449a-aa13-ec43ed506a18",
        "type": "AI",
        "updatedAt": "2023-06-28T04:44:13.342Z"
    },
    {
        "createdAt": "2023-06-28T08:17:20.381Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Laughing",
        "count": "4",
        "id": "7d804d74-a175-44fe-97a8-86380bc90471",
        "type": "AI",
        "updatedAt": "2023-06-28T08:17:20.381Z"
    },
    {
        "createdAt": "2023-06-28T08:20:33.194Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Blouse",
        "count": "4",
        "id": "36b5f6c0-0944-4fba-aea8-3dd5a9b613ae",
        "type": "AI",
        "updatedAt": "2023-06-28T08:20:33.194Z"
    },
    {
        "createdAt": "2023-06-29T08:59:01.822Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Switch",
        "count": "4",
        "id": "55bc2d63-ee1f-48a3-b888-4580901f9df1",
        "type": "AI",
        "updatedAt": "2023-06-29T08:59:01.822Z"
    },
    {
        "createdAt": "2023-06-29T09:09:25.478Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Rattle",
        "count": "4",
        "id": "475ba4a4-0e5a-4539-8d3a-654bda0ada82",
        "type": "AI",
        "updatedAt": "2023-06-29T09:09:25.478Z"
    },
    {
        "createdAt": "2023-06-29T09:26:14.626Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Lantern",
        "count": "4",
        "id": "14a10b48-c45c-4c20-9150-302429d4d795",
        "type": "AI",
        "updatedAt": "2023-06-29T09:26:14.626Z"
    },
    {
        "createdAt": "2023-07-08T05:18:53.102Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Letter",
        "count": "4",
        "id": "bc3afdea-fc4e-4908-b44f-78d798672e40",
        "type": "AI",
        "updatedAt": "2023-07-08T05:18:53.102Z"
    },
    {
        "createdAt": "2023-07-08T05:18:58.155Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Dining Table",
        "count": "4",
        "id": "3eae17fc-16f1-4ad0-a4be-35a2f5b101d1",
        "type": "AI",
        "updatedAt": "2023-07-08T05:18:58.155Z"
    },
    {
        "createdAt": "2023-07-08T05:19:04.486Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Railway",
        "count": "4",
        "id": "32c40220-13dc-412f-9c3f-5592d7a83f84",
        "type": "AI",
        "updatedAt": "2023-07-08T05:19:04.486Z"
    },
    {
        "createdAt": "2023-07-08T05:19:45.927Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Book",
        "count": "4",
        "id": "1349836f-4789-44da-a694-57602d6f9f5f",
        "type": "AI",
        "updatedAt": "2023-07-08T05:19:45.927Z"
    },
    {
        "createdAt": "2023-07-08T05:19:55.486Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Barefoot",
        "count": "4",
        "id": "247c1cc3-2b91-4c37-b079-dc65cff5b9f7",
        "type": "AI",
        "updatedAt": "2023-07-08T05:19:55.486Z"
    },
    {
        "createdAt": "2023-07-08T05:20:21.091Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Glass",
        "count": "4",
        "id": "7f0b1daf-d459-4d8e-8129-1e00e5b61072",
        "type": "AI",
        "updatedAt": "2023-07-08T05:20:21.091Z"
    },
    {
        "createdAt": "2023-07-08T05:20:21.091Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Lager",
        "count": "4",
        "id": "80a35e72-e550-432d-adc1-65b746788004",
        "type": "AI",
        "updatedAt": "2023-07-08T05:20:21.091Z"
    },
    {
        "createdAt": "2023-07-08T05:20:21.094Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Stout",
        "count": "4",
        "id": "688e3e39-f92a-4c7d-848a-88bf28b7a0a9",
        "type": "AI",
        "updatedAt": "2023-07-08T05:20:21.094Z"
    },
    {
        "createdAt": "2023-07-08T05:20:21.096Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Beer Glass",
        "count": "4",
        "id": "f13341a2-5d8d-4b93-8ca9-928dd12a2da4",
        "type": "AI",
        "updatedAt": "2023-07-08T05:20:21.096Z"
    },
    {
        "createdAt": "2023-07-08T05:20:23.572Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Credit Card",
        "count": "4",
        "id": "6a85a9c5-4461-4ed2-a9e9-a8581e567fd9",
        "type": "AI",
        "updatedAt": "2023-07-08T05:20:23.572Z"
    },
    {
        "createdAt": "2023-07-08T05:20:24.747Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Puppy",
        "count": "4",
        "id": "3c87c657-2c04-4961-bebf-59cd889db764",
        "type": "AI",
        "updatedAt": "2023-07-08T05:20:24.747Z"
    },
    {
        "createdAt": "2023-07-08T05:20:24.747Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cardboard",
        "count": "4",
        "id": "7a03a808-5422-4d25-8cfd-6e27490e11c9",
        "type": "AI",
        "updatedAt": "2023-07-08T05:20:24.747Z"
    },
    {
        "createdAt": "2023-07-08T05:20:24.747Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Carton",
        "count": "4",
        "id": "75b8696e-2d43-4951-b15f-7641ab420f8c",
        "type": "AI",
        "updatedAt": "2023-07-08T05:20:24.747Z"
    },
    {
        "createdAt": "2023-07-08T05:20:24.747Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Package",
        "count": "4",
        "id": "8b665113-061d-4f05-ad87-a3ed9372eb17",
        "type": "AI",
        "updatedAt": "2023-07-08T05:20:24.747Z"
    },
    {
        "createdAt": "2023-07-08T05:20:24.751Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Package Delivery",
        "count": "4",
        "id": "609a6953-3ea1-4947-ae72-99606e588b76",
        "type": "AI",
        "updatedAt": "2023-07-08T05:20:24.751Z"
    },
    {
        "createdAt": "2023-07-08T05:20:58.507Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Bracelet",
        "count": "4",
        "id": "5d7e09bc-4bb6-4944-8b6a-0256b63d693f",
        "type": "AI",
        "updatedAt": "2023-07-08T05:20:58.507Z"
    },
    {
        "createdAt": "2023-07-08T05:21:06.101Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Couch",
        "count": "4",
        "id": "d7c90623-096b-47a3-94d8-6e166cb5c1e0",
        "type": "AI",
        "updatedAt": "2023-07-08T05:21:06.101Z"
    },
    {
        "createdAt": "2023-07-08T05:21:07.625Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Lady",
        "count": "4",
        "id": "48efe53e-a2eb-4b79-b4a9-b0b02d61803f",
        "type": "AI",
        "updatedAt": "2023-07-08T05:21:07.625Z"
    },
    {
        "createdAt": "2023-07-12T20:12:01.618Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Brick",
        "count": "4",
        "id": "eff14f30-7281-45ef-b62b-4c12606f7949",
        "type": "AI",
        "updatedAt": "2023-07-12T20:12:01.618Z"
    },
    {
        "createdAt": "2022-07-22T15:56:59.920Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Blossom",
        "count": "3",
        "id": "af329a13-d002-473d-b15f-ddbaaf61704a",
        "type": "AI",
        "updatedAt": "2022-07-22T15:56:59.920Z"
    },
    {
        "createdAt": "2022-08-01T15:43:54.256Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Leisure Activities",
        "count": "3",
        "id": "0cc2ce52-be88-49ed-863c-4286d90ea5d6",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:54.256Z"
    },
    {
        "createdAt": "2022-08-01T15:43:56.961Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Smoothie",
        "count": "3",
        "id": "442da382-4978-4f4b-924f-b2c699725ea2",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:56.961Z"
    },
    {
        "createdAt": "2022-08-09T21:07:47.531Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Restaurant",
        "count": "3",
        "id": "0f08c2d7-5b21-45cf-878d-4ee644c1e2a0",
        "type": "AI",
        "updatedAt": "2022-08-09T21:07:47.531Z"
    },
    {
        "createdAt": "2022-08-09T21:07:47.532Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cafeteria",
        "count": "3",
        "id": "32fb8134-865e-4371-ba77-ba79a33c4edd",
        "type": "AI",
        "updatedAt": "2022-08-09T21:07:47.532Z"
    },
    {
        "createdAt": "2022-08-09T21:13:07.861Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Shorts",
        "count": "3",
        "id": "3e414ee2-576e-4714-abb2-db6d7a38156e",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:07.861Z"
    },
    {
        "createdAt": "2022-09-04T04:58:35.906Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Path",
        "count": "3",
        "id": "24a463a3-b33a-471c-a550-0cc587f0b3b0",
        "type": "AI",
        "updatedAt": "2022-09-04T04:58:35.906Z"
    },
    {
        "createdAt": "2022-09-08T18:12:20.876Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Fashion",
        "count": "3",
        "id": "35881cbd-cf3f-4b9b-a159-69af5f32b589",
        "type": "AI",
        "updatedAt": "2022-09-08T18:12:20.876Z"
    },
    {
        "createdAt": "2023-01-23T19:35:00.484Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Lawn",
        "count": "3",
        "id": "2df908a8-4e6d-43f2-8718-5ad45c39954d",
        "type": "AI",
        "updatedAt": "2023-01-23T19:35:00.484Z"
    },
    {
        "createdAt": "2023-02-03T22:27:30.719Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Hydrant",
        "count": "3",
        "id": "6ebe5df7-f703-440c-8d26-60f2f109cac9",
        "type": "AI",
        "updatedAt": "2023-02-03T22:27:30.719Z"
    },
    {
        "createdAt": "2023-02-09T14:50:53.546Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Blazer",
        "count": "3",
        "id": "c9a15b1f-35d0-4929-9254-7ff7306bd525",
        "type": "AI",
        "updatedAt": "2023-02-09T14:50:53.546Z"
    },
    {
        "createdAt": "2023-02-09T14:51:29.733Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Lime",
        "count": "3",
        "id": "7b92887e-2707-4683-a85c-ab6e1b3e4ff7",
        "type": "AI",
        "updatedAt": "2023-02-09T14:51:29.733Z"
    },
    {
        "createdAt": "2023-04-14T02:13:31.198Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Map",
        "count": "3",
        "id": "dfeeaba1-9388-413d-9ee8-e08e352c17a2",
        "type": "AI",
        "updatedAt": "2023-04-14T02:13:31.198Z"
    },
    {
        "createdAt": "2023-04-14T02:13:31.199Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Atlas",
        "count": "3",
        "id": "ff3ca351-1acf-4764-92cd-c071e23b04e5",
        "type": "AI",
        "updatedAt": "2023-04-14T02:13:31.199Z"
    },
    {
        "createdAt": "2023-06-07T20:40:45.367Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Swimming Pool",
        "count": "3",
        "id": "0b04b27f-aecf-4239-9dff-457d9c1ac501",
        "type": "AI",
        "updatedAt": "2023-06-07T20:40:45.367Z"
    },
    {
        "createdAt": "2023-06-26T12:28:23.666Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cup",
        "count": "3",
        "id": "5b9c8f0a-be9d-44ee-9ac9-c11c2b45b0c8",
        "type": "AI",
        "updatedAt": "2023-06-26T12:28:23.666Z"
    },
    {
        "createdAt": "2023-06-27T01:42:56.371Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sandal",
        "count": "3",
        "id": "735e8653-57cf-4e6d-8c47-feea423fb750",
        "type": "AI",
        "updatedAt": "2023-06-27T01:42:56.371Z"
    },
    {
        "createdAt": "2023-06-28T08:12:33.362Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Christmas",
        "count": "3",
        "id": "3a7451e1-2dd8-451e-934c-e484208d8b5f",
        "type": "AI",
        "updatedAt": "2023-06-28T08:12:33.362Z"
    },
    {
        "createdAt": "2023-06-28T08:12:33.362Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Christmas Decorations",
        "count": "3",
        "id": "0f5e382f-b2aa-4dec-ae71-279b53bcd7f6",
        "type": "AI",
        "updatedAt": "2023-06-28T08:12:33.362Z"
    },
    {
        "createdAt": "2023-06-28T08:12:33.363Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Festival",
        "count": "3",
        "id": "79878269-b625-4c84-b1cc-f6d23321b0c1",
        "type": "AI",
        "updatedAt": "2023-06-28T08:12:33.363Z"
    },
    {
        "createdAt": "2023-06-28T08:12:33.364Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cricket Ball",
        "count": "3",
        "id": "6cdb0e90-319f-4595-9c0b-33a6e55217a5",
        "type": "AI",
        "updatedAt": "2023-06-28T08:12:33.364Z"
    },
    {
        "createdAt": "2023-06-28T08:12:33.364Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Christmas Tree",
        "count": "3",
        "id": "7a7eeb17-efe6-4a36-883e-270f43509c06",
        "type": "AI",
        "updatedAt": "2023-06-28T08:12:33.364Z"
    },
    {
        "createdAt": "2023-06-28T08:12:48.246Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Dancing",
        "count": "3",
        "id": "475e0911-7cd2-4952-9d12-db528384579d",
        "type": "AI",
        "updatedAt": "2023-06-28T08:12:48.246Z"
    },
    {
        "createdAt": "2023-06-28T08:16:43.126Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Suede",
        "count": "3",
        "id": "ee1e8c4f-77af-47e6-aa39-f376a25391e1",
        "type": "AI",
        "updatedAt": "2023-06-28T08:16:43.126Z"
    },
    {
        "createdAt": "2023-06-28T08:21:50.101Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cake",
        "count": "3",
        "id": "67fb49cf-aa49-423c-8b4d-23716775bbf0",
        "type": "AI",
        "updatedAt": "2023-06-28T08:21:50.101Z"
    },
    {
        "createdAt": "2023-06-28T08:21:50.110Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cupcake",
        "count": "3",
        "id": "fa0ebc43-97cd-41a2-a2a4-06c8ec2a99e7",
        "type": "AI",
        "updatedAt": "2023-06-28T08:21:50.110Z"
    },
    {
        "createdAt": "2023-06-28T08:21:50.114Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Icing",
        "count": "3",
        "id": "8603e5c5-a885-43ca-a245-c611288b5750",
        "type": "AI",
        "updatedAt": "2023-06-28T08:21:50.114Z"
    },
    {
        "createdAt": "2023-06-29T07:51:51.310Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Bullet",
        "count": "3",
        "id": "88dea93f-c199-4c93-9412-553a20b89a33",
        "type": "AI",
        "updatedAt": "2023-06-29T07:51:51.310Z"
    },
    {
        "createdAt": "2023-06-29T09:13:13.273Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Blueberry",
        "count": "3",
        "id": "dc55c285-2343-401a-b171-ea80d9e55ece",
        "type": "AI",
        "updatedAt": "2023-06-29T09:13:13.273Z"
    },
    {
        "createdAt": "2023-06-29T09:13:13.274Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Berry",
        "count": "3",
        "id": "85ade84b-648e-45fb-9c6a-22cf4d32dfbc",
        "type": "AI",
        "updatedAt": "2023-06-29T09:13:13.274Z"
    },
    {
        "createdAt": "2023-07-08T05:19:16.058Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Business Card",
        "count": "3",
        "id": "e8fbfcbc-3a28-4b86-a3ab-5051175f5a07",
        "type": "AI",
        "updatedAt": "2023-07-08T05:19:16.058Z"
    },
    {
        "createdAt": "2023-07-08T05:19:18.324Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Writing",
        "count": "3",
        "id": "b162cea0-d185-4b6d-8d15-79959c494c88",
        "type": "AI",
        "updatedAt": "2023-07-08T05:19:18.324Z"
    },
    {
        "createdAt": "2023-07-08T05:19:18.325Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Pen",
        "count": "3",
        "id": "cc9fd585-fe9b-4433-a9a9-0a4ba1af36db",
        "type": "AI",
        "updatedAt": "2023-07-08T05:19:18.325Z"
    },
    {
        "createdAt": "2023-07-08T05:19:34.681Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Conversation",
        "count": "3",
        "id": "72d294ec-914b-4593-933a-0d232a2de7f6",
        "type": "AI",
        "updatedAt": "2023-07-08T05:19:34.681Z"
    },
    {
        "createdAt": "2023-07-08T05:19:34.682Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Interview",
        "count": "3",
        "id": "84f4fb23-c320-404a-8eb2-76ce00cde483",
        "type": "AI",
        "updatedAt": "2023-07-08T05:19:34.682Z"
    },
    {
        "createdAt": "2023-07-08T05:20:10.853Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Library",
        "count": "3",
        "id": "3527ebdf-2129-4b67-9cb8-f5ad240e8e44",
        "type": "AI",
        "updatedAt": "2023-07-08T05:20:10.853Z"
    },
    {
        "createdAt": "2023-07-08T05:20:45.202Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Iphone",
        "count": "3",
        "id": "8041a1e2-dbd1-48cf-996f-201182d9c89f",
        "type": "AI",
        "updatedAt": "2023-07-08T05:20:45.202Z"
    },
    {
        "createdAt": "2023-07-18T09:56:27.247Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Bride",
        "count": "3",
        "id": "93cfa257-c983-4028-b859-cfec1b6be1fb",
        "type": "AI",
        "updatedAt": "2023-07-18T09:56:27.247Z"
    },
    {
        "createdAt": "2023-07-19T21:07:46.770Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Purse",
        "count": "3",
        "id": "22b1de2c-c8e9-40e5-ac71-466e32c314da",
        "type": "AI",
        "updatedAt": "2023-07-19T21:07:46.770Z"
    },
    {
        "createdAt": "2022-07-22T15:57:03.351Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Accessory",
        "count": "2",
        "id": "5df9853f-9ad1-421b-8cb2-f0cebea2168d",
        "type": "AI",
        "updatedAt": "2022-07-22T15:57:03.351Z"
    },
    {
        "createdAt": "2022-07-22T15:57:05.304Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Leaf",
        "count": "2",
        "id": "7560ac85-be4f-430d-8601-e670f7826bca",
        "type": "AI",
        "updatedAt": "2022-07-22T15:57:05.304Z"
    },
    {
        "createdAt": "2022-07-22T19:01:36.455Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "T-Shirt",
        "count": "2",
        "id": "c9dfd24d-8c4e-49c6-b102-e80ba14597bb",
        "type": "AI",
        "updatedAt": "2022-07-22T19:01:36.455Z"
    },
    {
        "createdAt": "2022-08-01T15:43:54.256Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Stretch",
        "count": "2",
        "id": "dbc66f93-6e79-40e7-9343-3c92d1244f20",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:54.256Z"
    },
    {
        "createdAt": "2022-08-01T15:43:54.257Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Fitness",
        "count": "2",
        "id": "a8a1b30d-5ef4-48c0-997b-a67d75912963",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:54.257Z"
    },
    {
        "createdAt": "2022-08-01T15:43:54.257Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Working Out",
        "count": "2",
        "id": "333bf190-cfa8-4065-bd8a-3a8799d2882a",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:54.257Z"
    },
    {
        "createdAt": "2022-08-01T15:43:56.270Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Breakfast",
        "count": "2",
        "id": "21acb20e-5d8b-4ca9-b9e7-1147648edf41",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:56.270Z"
    },
    {
        "createdAt": "2022-08-01T15:43:56.961Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Milkshake",
        "count": "2",
        "id": "94d2b703-05f8-43dd-8797-1e81fb93cab3",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:56.961Z"
    },
    {
        "createdAt": "2022-08-01T15:43:57.450Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Apple",
        "count": "2",
        "id": "cd1d9215-952a-46d3-9893-b5432f194fa2",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:57.450Z"
    },
    {
        "createdAt": "2022-08-01T15:46:08.628Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Toast",
        "count": "2",
        "id": "d4601d75-c6f1-4a2e-836c-6722662f03e8",
        "type": "AI",
        "updatedAt": "2022-08-01T15:46:08.628Z"
    },
    {
        "createdAt": "2022-08-01T15:46:08.629Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "French Toast",
        "count": "2",
        "id": "cbb88b99-78bd-42aa-b8d0-5f2f7243bc30",
        "type": "AI",
        "updatedAt": "2022-08-01T15:46:08.629Z"
    },
    {
        "createdAt": "2022-08-01T15:46:10.029Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Grapefruit",
        "count": "2",
        "id": "9e6aba21-ed6f-4d2c-8fa3-2915c91d0490",
        "type": "AI",
        "updatedAt": "2022-08-01T15:46:10.029Z"
    },
    {
        "createdAt": "2022-08-09T21:12:04.231Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Dish",
        "count": "2",
        "id": "048f8604-5ae3-431f-bf07-14a4281ab813",
        "type": "AI",
        "updatedAt": "2022-08-09T21:12:04.231Z"
    },
    {
        "createdAt": "2022-08-09T21:12:15.360Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Watercraft",
        "count": "2",
        "id": "b3a0308b-d0e7-471b-b9e4-c241ad12a728",
        "type": "AI",
        "updatedAt": "2022-08-09T21:12:15.360Z"
    },
    {
        "createdAt": "2022-08-09T21:13:14.758Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Herbs",
        "count": "2",
        "id": "e4be7160-4121-4f61-a67e-478bd6a716eb",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:14.758Z"
    },
    {
        "createdAt": "2022-08-09T21:13:14.758Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Herbal",
        "count": "2",
        "id": "ef27e315-4ee8-4201-9736-eaf1f9f435ba",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:14.758Z"
    },
    {
        "createdAt": "2022-08-09T21:13:43.722Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sunlight",
        "count": "2",
        "id": "d76d9b32-a64c-4349-aa3a-103f01c96098",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:43.722Z"
    },
    {
        "createdAt": "2022-10-26T18:19:39.832Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Scarf",
        "count": "2",
        "id": "3a2d2129-d2a7-4a13-98fa-331ec49bf576",
        "type": "AI",
        "updatedAt": "2022-10-26T18:19:39.832Z"
    },
    {
        "createdAt": "2022-10-26T18:19:39.833Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sweater",
        "count": "2",
        "id": "9b69c7b4-135a-4be9-896f-5a75c5b0c5fc",
        "type": "AI",
        "updatedAt": "2022-10-26T18:19:39.833Z"
    },
    {
        "createdAt": "2023-01-19T17:36:43.467Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Soil",
        "count": "2",
        "id": "f9f09801-8ab0-4832-b423-600ae324672f",
        "type": "AI",
        "updatedAt": "2023-01-19T17:36:43.467Z"
    },
    {
        "createdAt": "2023-01-23T19:35:02.952Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Traffic Light",
        "count": "2",
        "id": "e2117ece-c08d-40d1-8118-80a4ecdb3647",
        "type": "AI",
        "updatedAt": "2023-01-23T19:35:02.952Z"
    },
    {
        "createdAt": "2023-01-23T19:35:02.952Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sun",
        "count": "2",
        "id": "281fc231-5a17-4c20-8670-7edabd1d4e68",
        "type": "AI",
        "updatedAt": "2023-01-23T19:35:02.952Z"
    },
    {
        "createdAt": "2023-02-09T14:50:52.482Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Plateau",
        "count": "2",
        "id": "1dc349d5-c41f-48d6-b417-afc1545a500b",
        "type": "AI",
        "updatedAt": "2023-02-09T14:50:52.482Z"
    },
    {
        "createdAt": "2023-02-09T14:50:52.482Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Valley",
        "count": "2",
        "id": "ccb6e3cc-85ea-4740-bf39-0f6c12bb41c2",
        "type": "AI",
        "updatedAt": "2023-02-09T14:50:52.482Z"
    },
    {
        "createdAt": "2023-02-09T14:50:52.482Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Canyon",
        "count": "2",
        "id": "32d4d7bd-f35a-4420-a6e6-b6fbd268109c",
        "type": "AI",
        "updatedAt": "2023-02-09T14:50:52.482Z"
    },
    {
        "createdAt": "2023-02-09T14:50:52.483Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Wilderness",
        "count": "2",
        "id": "8f38d893-ae3c-4e4f-ad73-b30d18d1657c",
        "type": "AI",
        "updatedAt": "2023-02-09T14:50:52.483Z"
    },
    {
        "createdAt": "2023-02-09T14:50:59.320Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Horse",
        "count": "2",
        "id": "298ec200-d851-4c91-a5e5-eff2451f4326",
        "type": "AI",
        "updatedAt": "2023-02-09T14:50:59.320Z"
    },
    {
        "createdAt": "2023-02-09T14:51:04.331Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Snow",
        "count": "2",
        "id": "cb3dac78-8b7b-4b1f-ba48-627c40a204f5",
        "type": "AI",
        "updatedAt": "2023-02-09T14:51:04.331Z"
    },
    {
        "createdAt": "2023-02-09T14:51:10.355Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Surfing",
        "count": "2",
        "id": "dbb1fe8d-a8bb-40b1-9036-0aa98dbfa0ea",
        "type": "AI",
        "updatedAt": "2023-02-09T14:51:10.355Z"
    },
    {
        "createdAt": "2023-02-09T14:51:18.382Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Hiking",
        "count": "2",
        "id": "43b58204-1e35-49fb-ba9b-4d6e0faf39d1",
        "type": "AI",
        "updatedAt": "2023-02-09T14:51:18.382Z"
    },
    {
        "createdAt": "2023-02-09T14:51:18.383Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Backpacking",
        "count": "2",
        "id": "b1ae228d-43ce-4581-8a77-97a1da4923e7",
        "type": "AI",
        "updatedAt": "2023-02-09T14:51:18.383Z"
    },
    {
        "createdAt": "2023-02-09T14:51:29.175Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cocktail",
        "count": "2",
        "id": "dff6b774-020c-4748-86a2-0445d45acdd0",
        "type": "AI",
        "updatedAt": "2023-02-09T14:51:29.175Z"
    },
    {
        "createdAt": "2023-02-09T14:51:37.705Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Tarmac",
        "count": "2",
        "id": "a8bb0048-2d38-4bc0-bd66-f026975c01a0",
        "type": "AI",
        "updatedAt": "2023-02-09T14:51:37.705Z"
    },
    {
        "createdAt": "2023-02-09T14:51:37.705Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Hoodie",
        "count": "2",
        "id": "aa16cb63-cba7-4e9a-b279-e93697368475",
        "type": "AI",
        "updatedAt": "2023-02-09T14:51:37.705Z"
    },
    {
        "createdAt": "2023-02-25T17:01:34.225Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Panoramic",
        "count": "2",
        "id": "82f20d79-9dfd-45f5-bce0-a184b18bf24e",
        "type": "AI",
        "updatedAt": "2023-02-25T17:01:34.225Z"
    },
    {
        "createdAt": "2023-03-02T12:45:39.410Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Device",
        "count": "2",
        "id": "e1408618-92e3-4905-b7ba-8444971d5444",
        "type": "AI",
        "updatedAt": "2023-03-02T12:45:39.410Z"
    },
    {
        "createdAt": "2023-03-06T16:57:44.332Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Park",
        "count": "2",
        "id": "39217656-0cdc-4bd8-b26a-9db31fb084bf",
        "type": "AI",
        "updatedAt": "2023-03-06T16:57:44.332Z"
    },
    {
        "createdAt": "2023-03-22T08:16:32.795Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Headphones",
        "count": "2",
        "id": "a0df752e-870e-4df7-8fe8-c93e34ff81bd",
        "type": "AI",
        "updatedAt": "2023-03-22T08:16:32.795Z"
    },
    {
        "createdAt": "2023-03-23T21:42:08.968Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "18-wheeler Truck",
        "count": "2",
        "id": "6b918af7-f0c8-4808-aeb6-f01eb907d43a",
        "type": "AI",
        "updatedAt": "2023-03-23T21:42:08.968Z"
    },
    {
        "createdAt": "2023-04-03T10:31:53.001Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Plastic",
        "count": "2",
        "id": "a9cc00e8-63f6-4f49-9c80-70b972ffe873",
        "type": "AI",
        "updatedAt": "2023-04-03T10:31:53.001Z"
    },
    {
        "createdAt": "2023-04-03T10:32:01.354Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Shaker",
        "count": "2",
        "id": "7149d014-a988-4aa0-ad9e-f9f4bee881aa",
        "type": "AI",
        "updatedAt": "2023-04-03T10:32:01.354Z"
    },
    {
        "createdAt": "2023-04-03T10:32:51.843Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Ditch",
        "count": "2",
        "id": "7cea5929-84f6-4bf3-b0fe-9ee5f67ee5ad",
        "type": "AI",
        "updatedAt": "2023-04-03T10:32:51.843Z"
    },
    {
        "createdAt": "2023-04-03T10:32:51.843Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Canal",
        "count": "2",
        "id": "dd42ca3e-2365-4b8d-8de5-73ffa39cae79",
        "type": "AI",
        "updatedAt": "2023-04-03T10:32:51.843Z"
    },
    {
        "createdAt": "2023-04-03T10:32:51.843Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Fortress",
        "count": "2",
        "id": "4cf217a8-00be-4172-8675-2aa28eae7756",
        "type": "AI",
        "updatedAt": "2023-04-03T10:32:51.843Z"
    },
    {
        "createdAt": "2023-04-14T02:13:31.539Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Plan",
        "count": "2",
        "id": "4a5c7a0a-5f1c-44ab-a738-62913550e0cf",
        "type": "AI",
        "updatedAt": "2023-04-14T02:13:31.539Z"
    },
    {
        "createdAt": "2023-05-30T11:09:18.694Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Food Presentation",
        "count": "2",
        "id": "c2a2ba64-3950-4e53-83e9-0e46b492e9d4",
        "type": "AI",
        "updatedAt": "2023-05-30T11:09:18.694Z"
    },
    {
        "createdAt": "2023-05-30T11:09:21.576Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Seafood",
        "count": "2",
        "id": "b58a4662-aba3-44fb-8a23-a237fb75f8d6",
        "type": "AI",
        "updatedAt": "2023-05-30T11:09:21.576Z"
    },
    {
        "createdAt": "2023-05-30T11:09:21.577Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Salmon",
        "count": "2",
        "id": "3a7c76e9-8506-4b96-a7d4-91ddd4f31301",
        "type": "AI",
        "updatedAt": "2023-05-30T11:09:21.577Z"
    },
    {
        "createdAt": "2023-06-07T20:40:45.366Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Backyard",
        "count": "2",
        "id": "ccad0dde-1b0a-4cdc-8529-813f9b75db37",
        "type": "AI",
        "updatedAt": "2023-06-07T20:40:45.366Z"
    },
    {
        "createdAt": "2023-06-28T08:12:04.544Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Diner",
        "count": "2",
        "id": "2e3a7d66-2b70-4bae-8cb9-aa2a401a944c",
        "type": "AI",
        "updatedAt": "2023-06-28T08:12:04.544Z"
    },
    {
        "createdAt": "2023-06-28T08:12:04.544Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Neon",
        "count": "2",
        "id": "976e5298-5029-45e2-a6ac-247bcff65606",
        "type": "AI",
        "updatedAt": "2023-06-28T08:12:04.544Z"
    },
    {
        "createdAt": "2023-06-28T08:12:26.102Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Fritters",
        "count": "2",
        "id": "15534daa-ff98-4e83-b2d6-98056feb1f80",
        "type": "AI",
        "updatedAt": "2023-06-28T08:12:26.102Z"
    },
    {
        "createdAt": "2023-06-28T08:12:26.103Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cutlet",
        "count": "2",
        "id": "713226a0-e7ae-4fcf-802e-43d992d35fb1",
        "type": "AI",
        "updatedAt": "2023-06-28T08:12:26.103Z"
    },
    {
        "createdAt": "2023-06-28T08:15:29.630Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Kissing",
        "count": "2",
        "id": "c9d4c2ed-3612-4efc-8702-66ecb90a49f9",
        "type": "AI",
        "updatedAt": "2023-06-28T08:15:29.630Z"
    },
    {
        "createdAt": "2023-06-28T08:15:29.634Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Romantic",
        "count": "2",
        "id": "036ec126-3a7a-4498-8639-466ea5ba22e4",
        "type": "AI",
        "updatedAt": "2023-06-28T08:15:29.634Z"
    },
    {
        "createdAt": "2023-06-28T08:16:43.126Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Canvas",
        "count": "2",
        "id": "1f41128d-31cd-449b-b76b-fa6c61838954",
        "type": "AI",
        "updatedAt": "2023-06-28T08:16:43.126Z"
    },
    {
        "createdAt": "2023-06-28T08:16:58.706Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Standing",
        "count": "2",
        "id": "a7a301cb-51e8-425b-b1dc-f7478f53f12b",
        "type": "AI",
        "updatedAt": "2023-06-28T08:16:58.706Z"
    },
    {
        "createdAt": "2023-06-28T08:17:37.594Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Boot",
        "count": "2",
        "id": "3a37c98c-f675-40cc-9ea7-b55d890bc73d",
        "type": "AI",
        "updatedAt": "2023-06-28T08:17:37.594Z"
    },
    {
        "createdAt": "2023-06-28T08:17:46.910Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Running Shoe",
        "count": "2",
        "id": "fe8efffa-d3bd-4ba9-bfb5-d0fbc17b0a44",
        "type": "AI",
        "updatedAt": "2023-06-28T08:17:46.910Z"
    },
    {
        "createdAt": "2023-06-28T08:18:08.104Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Caravan",
        "count": "2",
        "id": "36120f3b-1848-4dc9-bcfd-d640df2d4246",
        "type": "AI",
        "updatedAt": "2023-06-28T08:18:08.104Z"
    },
    {
        "createdAt": "2023-06-28T08:18:08.118Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Van",
        "count": "2",
        "id": "39875b98-9288-4181-b52f-f288e06a0241",
        "type": "AI",
        "updatedAt": "2023-06-28T08:18:08.118Z"
    },
    {
        "createdAt": "2023-06-29T07:05:16.462Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Oilfield",
        "count": "2",
        "id": "5822055d-cac3-474e-a62a-ac9f685e6a4b",
        "type": "AI",
        "updatedAt": "2023-06-29T07:05:16.462Z"
    },
    {
        "createdAt": "2023-06-29T07:43:21.634Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Analog Clock",
        "count": "2",
        "id": "a643720a-96cb-47fc-8c22-0b5d456dcbd4",
        "type": "AI",
        "updatedAt": "2023-06-29T07:43:21.634Z"
    },
    {
        "createdAt": "2023-06-29T07:43:21.634Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Clock",
        "count": "2",
        "id": "d35e05aa-6d15-40aa-9f41-b75c910ee9c1",
        "type": "AI",
        "updatedAt": "2023-06-29T07:43:21.634Z"
    },
    {
        "createdAt": "2023-06-29T07:43:37.038Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Stencil",
        "count": "2",
        "id": "95219456-5f69-4f9a-8c26-8c3f2ffea459",
        "type": "AI",
        "updatedAt": "2023-06-29T07:43:37.038Z"
    },
    {
        "createdAt": "2023-06-29T07:50:53.819Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Maze",
        "count": "2",
        "id": "aac0412e-ad22-47b3-8b08-445a1bf95e4e",
        "type": "AI",
        "updatedAt": "2023-06-29T07:50:53.819Z"
    },
    {
        "createdAt": "2023-06-29T08:57:24.340Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Firearm",
        "count": "2",
        "id": "65912dd5-32d5-461d-ae34-56916be9cd2e",
        "type": "AI",
        "updatedAt": "2023-06-29T08:57:24.340Z"
    },
    {
        "createdAt": "2023-07-08T03:17:25.270Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Safe",
        "count": "2",
        "id": "3315f7c8-90b1-4ea6-a545-3225c9e54b40",
        "type": "AI",
        "updatedAt": "2023-07-08T03:17:25.270Z"
    },
    {
        "createdAt": "2023-07-08T03:17:30.525Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Slate",
        "count": "2",
        "id": "8e8b1cdd-7127-44dd-ae1f-f50f65f12479",
        "type": "AI",
        "updatedAt": "2023-07-08T03:17:30.525Z"
    },
    {
        "createdAt": "2023-07-12T20:12:01.618Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Wall",
        "count": "2",
        "id": "edae5165-aa58-4b18-aab8-08a1588ddbbf",
        "type": "AI",
        "updatedAt": "2023-07-12T20:12:01.618Z"
    },
    {
        "createdAt": "2023-07-18T09:56:17.020Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Hood",
        "count": "2",
        "id": "8e1e07dc-ade9-4cce-ab69-956e20d9c12c",
        "type": "AI",
        "updatedAt": "2023-07-18T09:56:17.020Z"
    },
    {
        "createdAt": "2023-08-16T01:41:21.435Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Office Building",
        "count": "2",
        "id": "2214a635-2be0-4eec-bcde-e459be2778aa",
        "type": "AI",
        "updatedAt": "2023-08-16T01:41:21.435Z"
    },
    {
        "createdAt": "2023-08-29T17:46:03.378Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Fence",
        "count": "2",
        "id": "d684a24a-1210-4363-aeeb-e55164b22769",
        "type": "AI",
        "updatedAt": "2023-08-29T17:46:03.378Z"
    },
    {
        "createdAt": "2023-10-06T08:06:26.402Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Blade",
        "count": "2",
        "id": "c41ce64c-b5ea-4ab5-afa7-3d0ebbb911a2",
        "type": "AI",
        "updatedAt": "2023-10-06T08:06:26.402Z"
    },
    {
        "createdAt": "2022-07-19T20:22:13.559Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Golf Club",
        "count": "1",
        "id": "49527c74-5d09-4cd9-af5f-3b0b20799613",
        "type": "AI",
        "updatedAt": "2022-07-19T20:22:13.559Z"
    },
    {
        "createdAt": "2022-07-19T20:22:13.560Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Golf",
        "count": "1",
        "id": "4fc6ebfc-3ff6-4b84-baff-2ed88fae8b1c",
        "type": "AI",
        "updatedAt": "2022-07-19T20:22:13.560Z"
    },
    {
        "createdAt": "2022-07-19T20:22:14.173Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Rocket",
        "count": "1",
        "id": "616df71d-422e-4eaf-a8cb-1b3a1db932c3",
        "type": "AI",
        "updatedAt": "2022-07-19T20:22:14.173Z"
    },
    {
        "createdAt": "2022-07-22T15:57:01.075Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Drawing",
        "count": "1",
        "id": "ab080cc5-b039-4851-939a-1b8435d16249",
        "type": "AI",
        "updatedAt": "2022-07-22T15:57:01.075Z"
    },
    {
        "createdAt": "2022-07-22T15:57:03.351Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Crown",
        "count": "1",
        "id": "45039d4c-6932-4af7-93b5-82194619b9e7",
        "type": "AI",
        "updatedAt": "2022-07-22T15:57:03.351Z"
    },
    {
        "createdAt": "2022-08-01T15:43:05.188Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Insect",
        "count": "1",
        "id": "5e1d0919-9f41-4698-9985-ba9cf15e648f",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:05.188Z"
    },
    {
        "createdAt": "2022-08-01T15:43:05.189Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Invertebrate",
        "count": "1",
        "id": "628dac62-ce5c-48e5-9e9c-ad5d227836f1",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:05.189Z"
    },
    {
        "createdAt": "2022-08-01T15:43:05.190Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Droplet",
        "count": "1",
        "id": "02e39fd7-ed58-4a11-b314-dbe6bc2fba2b",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:05.190Z"
    },
    {
        "createdAt": "2022-08-01T15:43:54.256Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Dance Pose",
        "count": "1",
        "id": "510364f4-58c2-41d8-9b07-d277e3f0bfc3",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:54.256Z"
    },
    {
        "createdAt": "2022-08-01T15:43:56.271Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Oatmeal",
        "count": "1",
        "id": "bc532ad5-729b-4fd3-aaf3-7f58e6c3f3db",
        "type": "AI",
        "updatedAt": "2022-08-01T15:43:56.271Z"
    },
    {
        "createdAt": "2022-08-01T15:46:10.029Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Seasoning",
        "count": "1",
        "id": "bcb91c5f-5fde-4d4f-aaf2-a91d6392e6e3",
        "type": "AI",
        "updatedAt": "2022-08-01T15:46:10.029Z"
    },
    {
        "createdAt": "2022-08-04T17:07:06.308Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Tabletop",
        "count": "1",
        "id": "41133ef2-7aed-4ad0-96e4-e455d24a5809",
        "type": "AI",
        "updatedAt": "2022-08-04T17:07:06.308Z"
    },
    {
        "createdAt": "2022-08-09T13:27:24.331Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Pedestrian",
        "count": "1",
        "id": "6a530974-9a8b-4046-bfbb-e898663e84e9",
        "type": "AI",
        "updatedAt": "2022-08-09T13:27:24.331Z"
    },
    {
        "createdAt": "2022-08-09T13:27:37.156Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Audience",
        "count": "1",
        "id": "53d4220d-8d9a-4ec7-8468-86d981f0c19b",
        "type": "AI",
        "updatedAt": "2022-08-09T13:27:37.156Z"
    },
    {
        "createdAt": "2022-08-09T21:07:42.854Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Flyer",
        "count": "1",
        "id": "16c79903-c1a6-474a-91e5-a13ccd726a11",
        "type": "AI",
        "updatedAt": "2022-08-09T21:07:42.854Z"
    },
    {
        "createdAt": "2022-08-09T21:07:47.532Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cafe",
        "count": "1",
        "id": "fafeed4e-c531-4026-8ff1-d75a39fa3915",
        "type": "AI",
        "updatedAt": "2022-08-09T21:07:47.532Z"
    },
    {
        "createdAt": "2022-08-09T21:07:47.533Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Food Court",
        "count": "1",
        "id": "b3a6ec07-108d-42fd-9dfc-23302c3737a4",
        "type": "AI",
        "updatedAt": "2022-08-09T21:07:47.533Z"
    },
    {
        "createdAt": "2022-08-09T21:12:34.091Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Marina",
        "count": "1",
        "id": "1f2dcb84-1c7e-47bb-b64f-6bb7c24e31b6",
        "type": "AI",
        "updatedAt": "2022-08-09T21:12:34.091Z"
    },
    {
        "createdAt": "2022-08-09T21:12:34.091Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Metropolis",
        "count": "1",
        "id": "bb752128-6031-45da-b51a-3d35a89b07bf",
        "type": "AI",
        "updatedAt": "2022-08-09T21:12:34.091Z"
    },
    {
        "createdAt": "2022-08-09T21:12:51.220Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Tower",
        "count": "1",
        "id": "d2ae5406-02e7-4592-a2c4-6f7b4306a378",
        "type": "AI",
        "updatedAt": "2022-08-09T21:12:51.220Z"
    },
    {
        "createdAt": "2022-08-09T21:13:14.756Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Pottery",
        "count": "1",
        "id": "a9d5f4fd-ed3b-4e84-a154-34574e715fd7",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:14.756Z"
    },
    {
        "createdAt": "2022-08-09T21:13:23.821Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Urban",
        "count": "1",
        "id": "4bf10d69-73fe-43d5-b781-7c08a7af3c3b",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:23.821Z"
    },
    {
        "createdAt": "2022-08-09T21:13:34.795Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Fir",
        "count": "1",
        "id": "b0f9f55d-0af8-4ddd-96fe-3261e5ab849c",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:34.795Z"
    },
    {
        "createdAt": "2022-08-09T21:13:34.795Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Vegetation",
        "count": "1",
        "id": "3f804a41-cb7d-47a3-89ee-3ec6c808f73b",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:34.795Z"
    },
    {
        "createdAt": "2022-08-09T21:13:56.973Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sailboat",
        "count": "1",
        "id": "de276682-6bd1-4868-ad58-d39ddf9d1220",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:56.973Z"
    },
    {
        "createdAt": "2022-09-08T16:33:16.727Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Costume",
        "count": "1",
        "id": "e62acd80-2a0f-4354-8b11-6b8a056be355",
        "type": "AI",
        "updatedAt": "2022-09-08T16:33:16.727Z"
    },
    {
        "createdAt": "2022-09-08T17:53:47.337Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cabinet",
        "count": "1",
        "id": "7584eaf1-f55e-443f-9e43-b817e08097bf",
        "type": "AI",
        "updatedAt": "2022-09-08T17:53:47.337Z"
    },
    {
        "createdAt": "2022-10-10T20:32:50.527Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Rose",
        "count": "1",
        "id": "aa008389-538d-4cdb-a9fa-85e243bcb793",
        "type": "AI",
        "updatedAt": "2022-10-10T20:32:50.527Z"
    },
    {
        "createdAt": "2022-10-11T21:24:34.676Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Orange",
        "count": "1",
        "id": "2513e316-3f8b-41f4-bfcc-8d27e05efa50",
        "type": "AI",
        "updatedAt": "2022-10-11T21:24:34.676Z"
    },
    {
        "createdAt": "2022-10-25T14:21:34.292Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Fish",
        "count": "1",
        "id": "96ca17e3-3c66-41d1-8bae-e669adcf64e0",
        "type": "AI",
        "updatedAt": "2022-10-25T14:21:34.292Z"
    },
    {
        "createdAt": "2022-11-07T14:11:13.715Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Fist",
        "count": "1",
        "id": "7aca5398-3928-4c62-869b-13f25e122d93",
        "type": "AI",
        "updatedAt": "2022-11-07T14:11:13.715Z"
    },
    {
        "createdAt": "2022-11-07T14:11:13.715Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Wrist",
        "count": "1",
        "id": "bb1d38fb-fb10-4425-9370-6e9e64a86055",
        "type": "AI",
        "updatedAt": "2022-11-07T14:11:13.715Z"
    },
    {
        "createdAt": "2023-01-26T16:40:25.400Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Palm Tree",
        "count": "1",
        "id": "0a3cf903-9108-491c-ac05-ce7dc5d1e58c",
        "type": "AI",
        "updatedAt": "2023-01-26T16:40:25.400Z"
    },
    {
        "createdAt": "2023-02-03T20:26:27.264Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Pipeline",
        "count": "1",
        "id": "0c551877-f771-43b8-92d9-b04c5011499d",
        "type": "AI",
        "updatedAt": "2023-02-03T20:26:27.264Z"
    },
    {
        "createdAt": "2023-02-03T20:26:27.854Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Tape",
        "count": "1",
        "id": "1a5073a5-71f1-4f4f-b338-e9871a5d997d",
        "type": "AI",
        "updatedAt": "2023-02-03T20:26:27.854Z"
    },
    {
        "createdAt": "2023-02-09T14:50:56.953Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Climbing",
        "count": "1",
        "id": "1674a241-58e5-4c32-a5ba-0042424d5131",
        "type": "AI",
        "updatedAt": "2023-02-09T14:50:56.953Z"
    },
    {
        "createdAt": "2023-02-09T14:50:56.954Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Rock Climbing",
        "count": "1",
        "id": "9d75bb16-8616-4b1e-a7da-7f153b74fa3c",
        "type": "AI",
        "updatedAt": "2023-02-09T14:50:56.954Z"
    },
    {
        "createdAt": "2023-02-09T14:50:56.954Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Adventure",
        "count": "1",
        "id": "3f0ef451-669c-4ae8-b8e5-8feae98d2f5f",
        "type": "AI",
        "updatedAt": "2023-02-09T14:50:56.954Z"
    },
    {
        "createdAt": "2023-02-09T14:50:59.319Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Soda",
        "count": "1",
        "id": "31072600-0309-4197-a047-2fc3c4a4ba52",
        "type": "AI",
        "updatedAt": "2023-02-09T14:50:59.319Z"
    },
    {
        "createdAt": "2023-02-09T14:51:10.354Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sea Waves",
        "count": "1",
        "id": "23f8debe-ee45-493d-8998-6c31b74bd11b",
        "type": "AI",
        "updatedAt": "2023-02-09T14:51:10.354Z"
    },
    {
        "createdAt": "2023-02-09T14:51:10.355Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Lifejacket",
        "count": "1",
        "id": "7c20571c-4de0-4a46-af80-f2753f05caee",
        "type": "AI",
        "updatedAt": "2023-02-09T14:51:10.355Z"
    },
    {
        "createdAt": "2023-02-09T14:51:18.382Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Mountain Range",
        "count": "1",
        "id": "df7345d8-71cd-45c4-a608-3615651b1c11",
        "type": "AI",
        "updatedAt": "2023-02-09T14:51:18.382Z"
    },
    {
        "createdAt": "2023-02-09T14:51:29.175Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Mojito",
        "count": "1",
        "id": "63c19bd7-077c-42b3-8119-4165dfaa7494",
        "type": "AI",
        "updatedAt": "2023-02-09T14:51:29.175Z"
    },
    {
        "createdAt": "2023-02-09T14:51:31.981Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Ice Cream",
        "count": "1",
        "id": "3de99089-5ae0-4551-a69f-828d362e5381",
        "type": "AI",
        "updatedAt": "2023-02-09T14:51:31.981Z"
    },
    {
        "createdAt": "2023-02-14T13:28:16.654Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Workshop",
        "count": "1",
        "id": "d89faf3a-27b0-4a1a-aa9b-45ed1adb17c9",
        "type": "AI",
        "updatedAt": "2023-02-14T13:28:16.654Z"
    },
    {
        "createdAt": "2023-02-17T21:31:53.683Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Gin",
        "count": "1",
        "id": "ffceb724-578a-4998-b47b-471131618a5c",
        "type": "AI",
        "updatedAt": "2023-02-17T21:31:53.683Z"
    },
    {
        "createdAt": "2023-02-24T21:26:26.323Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Rainbow",
        "count": "1",
        "id": "cc4112ac-34c8-4cc8-acf6-45fd92b1fcc8",
        "type": "AI",
        "updatedAt": "2023-02-24T21:26:26.323Z"
    },
    {
        "createdAt": "2023-02-25T17:03:01.026Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Meadow",
        "count": "1",
        "id": "25f7e58d-a0e4-47dd-abfb-9d236e237a57",
        "type": "AI",
        "updatedAt": "2023-02-25T17:03:01.026Z"
    },
    {
        "createdAt": "2023-03-06T16:57:44.330Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sycamore",
        "count": "1",
        "id": "2d20a330-383f-49c2-9db0-6e194061d854",
        "type": "AI",
        "updatedAt": "2023-03-06T16:57:44.330Z"
    },
    {
        "createdAt": "2023-03-06T16:57:45.904Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Autumn",
        "count": "1",
        "id": "d2de34a7-3f26-4b39-8742-ad9a7ec0ea49",
        "type": "AI",
        "updatedAt": "2023-03-06T16:57:45.904Z"
    },
    {
        "createdAt": "2023-03-22T09:50:29.984Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Auditorium",
        "count": "1",
        "id": "dd838b8e-05b4-4d9a-b156-446d381937d1",
        "type": "AI",
        "updatedAt": "2023-03-22T09:50:29.984Z"
    },
    {
        "createdAt": "2023-03-22T09:50:29.984Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Hall",
        "count": "1",
        "id": "862880ee-e063-4a03-bae6-a2d065029622",
        "type": "AI",
        "updatedAt": "2023-03-22T09:50:29.984Z"
    },
    {
        "createdAt": "2023-03-22T09:50:29.985Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Theater",
        "count": "1",
        "id": "011152bf-414d-451b-9691-6f7656f3474a",
        "type": "AI",
        "updatedAt": "2023-03-22T09:50:29.985Z"
    },
    {
        "createdAt": "2023-03-22T09:50:29.986Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Stage",
        "count": "1",
        "id": "f806a67c-ff2e-4438-95c0-3b1394467537",
        "type": "AI",
        "updatedAt": "2023-03-22T09:50:29.986Z"
    },
    {
        "createdAt": "2023-03-22T09:50:29.986Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cinema",
        "count": "1",
        "id": "e6903ed7-93e2-4456-8d6b-adeeac61c922",
        "type": "AI",
        "updatedAt": "2023-03-22T09:50:29.986Z"
    },
    {
        "createdAt": "2023-03-23T21:43:49.480Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Airfield",
        "count": "1",
        "id": "1b0ea00d-0876-4207-93b8-73a46cb7d9c5",
        "type": "AI",
        "updatedAt": "2023-03-23T21:43:49.480Z"
    },
    {
        "createdAt": "2023-03-23T21:43:49.480Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Airport",
        "count": "1",
        "id": "39bef163-d9d9-4b58-a3cd-b76cdd93b86d",
        "type": "AI",
        "updatedAt": "2023-03-23T21:43:49.480Z"
    },
    {
        "createdAt": "2023-03-23T21:43:49.481Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Airplane",
        "count": "1",
        "id": "30690b5a-4030-4767-83c2-81c54eddd69e",
        "type": "AI",
        "updatedAt": "2023-03-23T21:43:49.481Z"
    },
    {
        "createdAt": "2023-03-23T21:43:49.482Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Airliner",
        "count": "1",
        "id": "a5ef3b20-42fc-49ef-849d-39060c4bad91",
        "type": "AI",
        "updatedAt": "2023-03-23T21:43:49.482Z"
    },
    {
        "createdAt": "2023-03-29T22:46:08.529Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Conifer",
        "count": "1",
        "id": "f931dcbf-c2b2-4b17-afe7-b558d53fa9f1",
        "type": "AI",
        "updatedAt": "2023-03-29T22:46:08.529Z"
    },
    {
        "createdAt": "2023-03-29T22:46:08.530Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Pond",
        "count": "1",
        "id": "14a73050-2df4-463c-ae57-6cb198ef2816",
        "type": "AI",
        "updatedAt": "2023-03-29T22:46:08.530Z"
    },
    {
        "createdAt": "2023-03-29T22:46:08.530Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Lake",
        "count": "1",
        "id": "715a0cdd-8de8-4ecc-a7ae-2a94f57e7992",
        "type": "AI",
        "updatedAt": "2023-03-29T22:46:08.530Z"
    },
    {
        "createdAt": "2023-03-29T22:46:08.531Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Pine",
        "count": "1",
        "id": "447f103e-81a3-4e1e-ac02-344841d67fa7",
        "type": "AI",
        "updatedAt": "2023-03-29T22:46:08.531Z"
    },
    {
        "createdAt": "2023-05-30T10:00:42.063Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Fried Egg",
        "count": "1",
        "id": "cc9e6f1c-11f4-4a28-aea1-3c128c07dfb3",
        "type": "AI",
        "updatedAt": "2023-05-30T10:00:42.063Z"
    },
    {
        "createdAt": "2023-05-30T11:09:18.695Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Platter",
        "count": "1",
        "id": "1131f0ed-4248-4d88-a9c2-cabcfe8a8df9",
        "type": "AI",
        "updatedAt": "2023-05-30T11:09:18.695Z"
    },
    {
        "createdAt": "2023-05-30T11:09:21.578Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Meat",
        "count": "1",
        "id": "a588a212-d887-4a04-af3a-8d556321f22e",
        "type": "AI",
        "updatedAt": "2023-05-30T11:09:21.578Z"
    },
    {
        "createdAt": "2023-05-30T11:09:21.578Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Pork",
        "count": "1",
        "id": "46ced942-2d20-43cc-a120-0a672ab078dd",
        "type": "AI",
        "updatedAt": "2023-05-30T11:09:21.578Z"
    },
    {
        "createdAt": "2023-06-07T20:40:45.367Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cow",
        "count": "1",
        "id": "66be1cbe-35b3-4030-92a3-117b662db604",
        "type": "AI",
        "updatedAt": "2023-06-07T20:40:45.367Z"
    },
    {
        "createdAt": "2023-06-09T08:41:08.796Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Doll",
        "count": "1",
        "id": "916860a7-0a99-45b7-9bad-21a25dd8ed7d",
        "type": "AI",
        "updatedAt": "2023-06-09T08:41:08.796Z"
    },
    {
        "createdAt": "2023-06-13T12:46:50.830Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Shark",
        "count": "1",
        "id": "ea2eddeb-4f19-4fb4-a40d-b0ac027d7c95",
        "type": "AI",
        "updatedAt": "2023-06-13T12:46:50.830Z"
    },
    {
        "createdAt": "2023-06-22T20:09:08.326Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Bus",
        "count": "1",
        "id": "409d8ba3-9071-4c2e-a977-2067d011c140",
        "type": "AI",
        "updatedAt": "2023-06-22T20:09:08.326Z"
    },
    {
        "createdAt": "2023-06-23T13:37:39.854Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Solo Performance",
        "count": "1",
        "id": "be1e7d2b-bcd1-4eed-b659-b99d5f251fdf",
        "type": "AI",
        "updatedAt": "2023-06-23T13:37:39.854Z"
    },
    {
        "createdAt": "2023-06-26T12:28:23.666Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Coffee",
        "count": "1",
        "id": "16493bbb-48d1-42c9-bc6c-089cf0e0c8a3",
        "type": "AI",
        "updatedAt": "2023-06-26T12:28:23.666Z"
    },
    {
        "createdAt": "2023-06-26T12:28:23.667Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Coffee Cup",
        "count": "1",
        "id": "55b42fa6-730f-4c59-b4ec-55d9ca29d383",
        "type": "AI",
        "updatedAt": "2023-06-26T12:28:23.667Z"
    },
    {
        "createdAt": "2023-06-26T12:28:23.667Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Latte",
        "count": "1",
        "id": "d058ad2d-395b-4076-867f-7de38ab4f0a0",
        "type": "AI",
        "updatedAt": "2023-06-26T12:28:23.667Z"
    },
    {
        "createdAt": "2023-06-28T04:44:17.666Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Penguin",
        "count": "1",
        "id": "20881f50-38c3-4580-81f2-bf2692d6c087",
        "type": "AI",
        "updatedAt": "2023-06-28T04:44:17.666Z"
    },
    {
        "createdAt": "2023-06-28T04:48:56.359Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Gray",
        "count": "1",
        "id": "f9517a74-e843-4631-8d31-38d8b25be889",
        "type": "AI",
        "updatedAt": "2023-06-28T04:48:56.359Z"
    },
    {
        "createdAt": "2023-06-28T04:49:05.746Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Giant Panda",
        "count": "1",
        "id": "b6e08f2e-db5f-455c-a02b-bb06fdddf4e7",
        "type": "AI",
        "updatedAt": "2023-06-28T04:49:05.746Z"
    },
    {
        "createdAt": "2023-06-28T08:18:08.126Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Bench",
        "count": "1",
        "id": "35fc99ae-db28-41d0-84c9-0bf530317d41",
        "type": "AI",
        "updatedAt": "2023-06-28T08:18:08.126Z"
    },
    {
        "createdAt": "2023-06-29T07:04:57.462Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Key",
        "count": "1",
        "id": "a97f5b57-e113-49ee-8c6d-dd93d607c519",
        "type": "AI",
        "updatedAt": "2023-06-29T07:04:57.462Z"
    },
    {
        "createdAt": "2023-06-29T07:05:27.638Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Belt",
        "count": "1",
        "id": "f13f49d1-85bf-44a8-b169-d71449e4bec9",
        "type": "AI",
        "updatedAt": "2023-06-29T07:05:27.638Z"
    },
    {
        "createdAt": "2023-06-29T07:05:38.230Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Tropical",
        "count": "1",
        "id": "890f887f-874f-4fb9-858e-4c527550a9fd",
        "type": "AI",
        "updatedAt": "2023-06-29T07:05:38.230Z"
    },
    {
        "createdAt": "2023-06-29T07:43:48.760Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Footprint",
        "count": "1",
        "id": "0dcec300-a703-44c1-b1dd-9634b7e35aac",
        "type": "AI",
        "updatedAt": "2023-06-29T07:43:48.760Z"
    },
    {
        "createdAt": "2023-06-29T07:43:48.760Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Hockey",
        "count": "1",
        "id": "ee27f8ff-42d6-4356-a468-985fadab18ae",
        "type": "AI",
        "updatedAt": "2023-06-29T07:43:48.760Z"
    },
    {
        "createdAt": "2023-06-29T07:43:48.761Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Rink",
        "count": "1",
        "id": "26766f38-9ae4-47bf-b3e6-bc13d6b4be71",
        "type": "AI",
        "updatedAt": "2023-06-29T07:43:48.761Z"
    },
    {
        "createdAt": "2023-06-29T07:43:48.762Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Ice Hockey Puck",
        "count": "1",
        "id": "88e599aa-27e0-402e-8eb2-8dc110941710",
        "type": "AI",
        "updatedAt": "2023-06-29T07:43:48.762Z"
    },
    {
        "createdAt": "2023-06-29T07:43:48.762Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Skating",
        "count": "1",
        "id": "86c6f0c7-0550-44e2-9e7f-107870d02e07",
        "type": "AI",
        "updatedAt": "2023-06-29T07:43:48.762Z"
    },
    {
        "createdAt": "2023-06-29T07:43:48.766Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Ice Hockey",
        "count": "1",
        "id": "e97bfa84-d819-497a-9b51-7b3522970130",
        "type": "AI",
        "updatedAt": "2023-06-29T07:43:48.766Z"
    },
    {
        "createdAt": "2023-06-29T07:51:09.606Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Earring",
        "count": "1",
        "id": "195e678f-4f3a-45bd-80ec-c17a98e04b36",
        "type": "AI",
        "updatedAt": "2023-06-29T07:51:09.606Z"
    },
    {
        "createdAt": "2023-06-29T08:57:06.004Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Gauge",
        "count": "1",
        "id": "27b30570-b7e9-42b0-a75e-b2d0196b0342",
        "type": "AI",
        "updatedAt": "2023-06-29T08:57:06.004Z"
    },
    {
        "createdAt": "2023-07-07T10:39:33.506Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Apidae",
        "count": "1",
        "id": "d50ee954-8ce1-44a0-a844-ad82cdcdd927",
        "type": "AI",
        "updatedAt": "2023-07-07T10:39:33.506Z"
    },
    {
        "createdAt": "2023-07-07T10:39:33.506Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Bee",
        "count": "1",
        "id": "a328e9e3-2ce0-4c70-804f-06167ba4231a",
        "type": "AI",
        "updatedAt": "2023-07-07T10:39:33.506Z"
    },
    {
        "createdAt": "2023-07-07T10:39:33.507Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Bumblebee",
        "count": "1",
        "id": "e59ae7e2-d089-4e48-bfab-52e5157eb1d2",
        "type": "AI",
        "updatedAt": "2023-07-07T10:39:33.507Z"
    },
    {
        "createdAt": "2023-07-07T10:39:33.507Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Honey Bee",
        "count": "1",
        "id": "74214e41-17bc-4449-9acf-47be1398902f",
        "type": "AI",
        "updatedAt": "2023-07-07T10:39:33.507Z"
    },
    {
        "createdAt": "2023-07-07T10:39:40.794Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Pot",
        "count": "1",
        "id": "63ac5d2b-51df-4a99-8d4f-f2852a6f1d1f",
        "type": "AI",
        "updatedAt": "2023-07-07T10:39:40.794Z"
    },
    {
        "createdAt": "2023-07-07T10:39:42.810Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Maroon",
        "count": "1",
        "id": "5739289d-61c1-4ce2-af83-7f835acbc151",
        "type": "AI",
        "updatedAt": "2023-07-07T10:39:42.810Z"
    },
    {
        "createdAt": "2023-07-08T05:23:22.230Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Bead",
        "count": "1",
        "id": "57223c54-c4da-438b-822c-b969d695494e",
        "type": "AI",
        "updatedAt": "2023-07-08T05:23:22.230Z"
    },
    {
        "createdAt": "2023-07-08T05:23:26.889Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Snake",
        "count": "1",
        "id": "5cc2225b-87dc-45bf-999f-8ebe6e61c437",
        "type": "AI",
        "updatedAt": "2023-07-08T05:23:26.889Z"
    },
    {
        "createdAt": "2023-07-08T05:23:26.890Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Reptile",
        "count": "1",
        "id": "71a95fd0-ed54-4e76-811d-2ded73910497",
        "type": "AI",
        "updatedAt": "2023-07-08T05:23:26.890Z"
    },
    {
        "createdAt": "2023-07-08T05:23:31.642Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Beard",
        "count": "1",
        "id": "e705c41d-5efb-4ad9-b82a-ed709d1cdbf4",
        "type": "AI",
        "updatedAt": "2023-07-08T05:23:31.642Z"
    },
    {
        "createdAt": "2023-07-08T05:25:22.789Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Modern Art",
        "count": "1",
        "id": "64170892-0c4d-4363-8307-b317291fce94",
        "type": "AI",
        "updatedAt": "2023-07-08T05:25:22.789Z"
    },
    {
        "createdAt": "2023-07-18T09:41:46.895Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cylinder",
        "count": "1",
        "id": "953fb562-90af-4a3d-b168-200142368af7",
        "type": "AI",
        "updatedAt": "2023-07-18T09:41:46.895Z"
    },
    {
        "createdAt": "2023-07-18T09:41:46.895Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Lipstick",
        "count": "1",
        "id": "8c2a3ab5-d753-44ca-8c6c-5f2695a96e88",
        "type": "AI",
        "updatedAt": "2023-07-18T09:41:46.895Z"
    },
    {
        "createdAt": "2023-07-18T09:56:10.947Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Smoke",
        "count": "1",
        "id": "3081fad6-ae5c-4f74-a23f-3e2aabd00e21",
        "type": "AI",
        "updatedAt": "2023-07-18T09:56:10.947Z"
    },
    {
        "createdAt": "2023-07-18T09:56:17.020Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Dagger",
        "count": "1",
        "id": "428ad203-1102-4696-90c7-fe3c03d87d58",
        "type": "AI",
        "updatedAt": "2023-07-18T09:56:17.020Z"
    },
    {
        "createdAt": "2023-07-18T09:56:22.471Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Performer",
        "count": "1",
        "id": "fa616d03-3105-40f4-bf38-ca3ff26e6a81",
        "type": "AI",
        "updatedAt": "2023-07-18T09:56:22.471Z"
    },
    {
        "createdAt": "2023-07-18T09:56:27.238Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Skin",
        "count": "1",
        "id": "da5461df-9ca5-4320-911f-398fc550597f",
        "type": "AI",
        "updatedAt": "2023-07-18T09:56:27.238Z"
    },
    {
        "createdAt": "2023-07-18T09:56:27.241Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Tattoo",
        "count": "1",
        "id": "4cc252ed-ec1b-4f8f-95de-664a42895d33",
        "type": "AI",
        "updatedAt": "2023-07-18T09:56:27.241Z"
    },
    {
        "createdAt": "2023-07-18T09:56:27.247Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Teeth",
        "count": "1",
        "id": "3f02c932-baf6-4c62-b1ac-078a714c8b00",
        "type": "AI",
        "updatedAt": "2023-07-18T09:56:27.247Z"
    },
    {
        "createdAt": "2023-07-18T09:56:30.742Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Knitwear",
        "count": "1",
        "id": "9490f49b-a0f0-4fb0-9773-2e2dc8a7bb2f",
        "type": "AI",
        "updatedAt": "2023-07-18T09:56:30.742Z"
    },
    {
        "createdAt": "2023-07-18T09:56:30.742Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sweatshirt",
        "count": "1",
        "id": "44bca1ec-8d34-487d-8160-c22d3e29d797",
        "type": "AI",
        "updatedAt": "2023-07-18T09:56:30.742Z"
    },
    {
        "createdAt": "2023-07-19T21:07:42.540Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Swimming",
        "count": "1",
        "id": "dd3f7ed2-4ce5-4654-8180-a295c32004b8",
        "type": "AI",
        "updatedAt": "2023-07-19T21:07:42.540Z"
    },
    {
        "createdAt": "2023-07-19T21:07:42.540Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Pool",
        "count": "1",
        "id": "ace6ff7a-c5ba-48c9-906c-b798f47a1c46",
        "type": "AI",
        "updatedAt": "2023-07-19T21:07:42.540Z"
    },
    {
        "createdAt": "2023-07-19T21:07:42.541Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Swimwear",
        "count": "1",
        "id": "4af2eff3-1cab-4047-8ad4-48952ce238c5",
        "type": "AI",
        "updatedAt": "2023-07-19T21:07:42.541Z"
    },
    {
        "createdAt": "2023-07-25T20:45:30.656Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Port",
        "count": "1",
        "id": "90a4e424-d7fc-4249-acc6-daec13760cb8",
        "type": "AI",
        "updatedAt": "2023-07-25T20:45:30.656Z"
    },
    {
        "createdAt": "2023-07-25T20:45:30.656Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Harbor",
        "count": "1",
        "id": "cebdf880-17cb-4906-9963-b59e40cd2361",
        "type": "AI",
        "updatedAt": "2023-07-25T20:45:30.656Z"
    },
    {
        "createdAt": "2023-08-01T08:14:29.435Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cave",
        "count": "1",
        "id": "53193fea-a776-4379-9e4d-a8ee3eab47e9",
        "type": "AI",
        "updatedAt": "2023-08-01T08:14:29.435Z"
    },
    {
        "createdAt": "2023-08-01T10:02:31.902Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Island",
        "count": "1",
        "id": "fa33f44f-f542-4eec-9987-47b5f41026b0",
        "type": "AI",
        "updatedAt": "2023-08-01T10:02:31.902Z"
    },
    {
        "createdAt": "2023-08-01T10:02:33.738Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Beachwear",
        "count": "1",
        "id": "92b13cb1-9a71-4cc2-a05a-8754143956cd",
        "type": "AI",
        "updatedAt": "2023-08-01T10:02:33.738Z"
    },
    {
        "createdAt": "2023-08-01T11:42:45.298Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Basketball (Ball)",
        "count": "1",
        "id": "a132a263-0f42-456b-b8cd-89008bed284a",
        "type": "AI",
        "updatedAt": "2023-08-01T11:42:45.298Z"
    },
    {
        "createdAt": "2023-08-01T11:42:48.247Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cargo",
        "count": "1",
        "id": "0a79503d-9c50-4c69-8894-009397eed138",
        "type": "AI",
        "updatedAt": "2023-08-01T11:42:48.247Z"
    },
    {
        "createdAt": "2023-08-08T19:23:44.094Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Yacht",
        "count": "1",
        "id": "a887f74c-7933-43d7-9d30-a20406d8acff",
        "type": "AI",
        "updatedAt": "2023-08-08T19:23:44.094Z"
    },
    {
        "createdAt": "2023-08-15T19:47:04.954Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Comics",
        "count": "1",
        "id": "04d9e198-620e-4eb1-8326-9225a8793cbf",
        "type": "AI",
        "updatedAt": "2023-08-15T19:47:04.954Z"
    },
    {
        "createdAt": "2023-08-16T01:41:21.435Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Yard",
        "count": "1",
        "id": "3351c1ee-f13b-44b6-9f2a-ee9961461753",
        "type": "AI",
        "updatedAt": "2023-08-16T01:41:21.435Z"
    },
    {
        "createdAt": "2023-08-16T01:41:21.435Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Neighborhood",
        "count": "1",
        "id": "16ec178c-f0fc-4b51-a06c-0bf7dc03e8ed",
        "type": "AI",
        "updatedAt": "2023-08-16T01:41:21.435Z"
    },
    {
        "createdAt": "2023-08-16T01:42:07.497Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Window",
        "count": "1",
        "id": "be0c6115-b63b-489f-bd2a-6294f58d457c",
        "type": "AI",
        "updatedAt": "2023-08-16T01:42:07.497Z"
    },
    {
        "createdAt": "2023-08-16T01:42:07.497Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Arch",
        "count": "1",
        "id": "62293b19-0d8b-4f20-889d-470d15201201",
        "type": "AI",
        "updatedAt": "2023-08-16T01:42:07.497Z"
    },
    {
        "createdAt": "2023-08-16T01:42:53.803Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Tunnel",
        "count": "1",
        "id": "1c9e692d-be14-4218-b58a-1fffb974199f",
        "type": "AI",
        "updatedAt": "2023-08-16T01:42:53.803Z"
    },
    {
        "createdAt": "2023-09-01T01:37:43.852Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Photobombing",
        "count": "1",
        "id": "2b59b710-b229-4838-9a58-3269e69014df",
        "type": "AI",
        "updatedAt": "2023-09-01T01:37:43.852Z"
    },
    {
        "createdAt": "2023-09-01T01:37:43.852Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Groupshot",
        "count": "1",
        "id": "9256e23a-ebc7-4b53-a7e1-e06cd90f711f",
        "type": "AI",
        "updatedAt": "2023-09-01T01:37:43.852Z"
    },
    {
        "createdAt": "2023-09-13T11:44:40.907Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sunset",
        "count": "1",
        "id": "62525880-1e75-434f-a0f0-5f882d24291a",
        "type": "AI",
        "updatedAt": "2023-09-13T11:44:40.907Z"
    },
    {
        "createdAt": "2023-09-13T11:44:40.908Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sunrise",
        "count": "1",
        "id": "0d056044-c15c-4c6f-b8fe-cb997136154d",
        "type": "AI",
        "updatedAt": "2023-09-13T11:44:40.908Z"
    },
    {
        "createdAt": "2023-09-13T16:14:47.329Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "High Heel",
        "count": "1",
        "id": "b0a7cd7c-6752-46a9-ac4b-6951911d0b92",
        "type": "AI",
        "updatedAt": "2023-09-13T16:14:47.329Z"
    },
    {
        "createdAt": "2023-09-26T23:19:02.448Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Desktop",
        "count": "1",
        "id": "cb1a4b49-a68c-40e9-beba-7881c5f78df6",
        "type": "AI",
        "updatedAt": "2023-09-26T23:19:02.448Z"
    },
    {
        "createdAt": "2023-09-26T23:19:05.777Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Gear",
        "count": "1",
        "id": "5f9b594a-427a-4e02-b3ac-048bdf720ae2",
        "type": "AI",
        "updatedAt": "2023-09-26T23:19:05.777Z"
    },
    {
        "createdAt": "2023-10-06T08:06:39.674Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Anchor",
        "count": "1",
        "id": "8d16849a-ce0e-49a8-a247-93896812e5e8",
        "type": "AI",
        "updatedAt": "2023-10-06T08:06:39.674Z"
    },
    {
        "createdAt": "2023-10-06T08:07:14.142Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Oval",
        "count": "1",
        "id": "6e4ed6bd-76cc-4e0d-bfaa-e602d62a9649",
        "type": "AI",
        "updatedAt": "2023-10-06T08:07:14.142Z"
    },
    {
        "createdAt": "2023-10-06T08:08:04.114Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Stopsign",
        "count": "1",
        "id": "dfd9a0ff-77bc-4f7d-a2af-52cf36dbc965",
        "type": "AI",
        "updatedAt": "2023-10-06T08:08:04.114Z"
    },
    {
        "createdAt": "2023-10-06T08:09:14.396Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Knot",
        "count": "1",
        "id": "572674ef-c9c4-4552-8f82-df87cb86e1a0",
        "type": "AI",
        "updatedAt": "2023-10-06T08:09:14.396Z"
    },
    {
        "createdAt": "2022-07-19T20:22:13.560Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sports",
        "count": "0",
        "id": "76e6fd61-9d22-423e-8e98-62cd285eee9f",
        "type": "AI",
        "updatedAt": "2022-07-19T20:22:13.560Z"
    },
    {
        "createdAt": "2022-07-19T20:22:14.174Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Launch",
        "count": "0",
        "id": "1e4f01fe-b007-4124-b68e-058b6de7b9c2",
        "type": "AI",
        "updatedAt": "2022-07-19T20:22:14.174Z"
    },
    {
        "createdAt": "2022-08-01T15:46:16.949Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Strawberry",
        "count": "0",
        "id": "4b4dc7a7-275a-46c2-a310-dee5d11a11cb",
        "type": "AI",
        "updatedAt": "2022-08-01T15:46:16.949Z"
    },
    {
        "createdAt": "2022-08-09T21:07:42.854Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Brochure",
        "count": "0",
        "id": "343a4cbe-446a-437d-b138-b7d1d597ebb7",
        "type": "AI",
        "updatedAt": "2022-08-09T21:07:42.854Z"
    },
    {
        "createdAt": "2022-08-09T21:11:50.241Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Peninsula",
        "count": "0",
        "id": "a14bc5dd-c63c-47bb-a323-7dad5004fe4b",
        "type": "AI",
        "updatedAt": "2022-08-09T21:11:50.241Z"
    },
    {
        "createdAt": "2022-08-09T21:12:44.310Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Fountain",
        "count": "0",
        "id": "a75cd4dc-c02e-40a1-91d0-6e4a0c7a7bfd",
        "type": "AI",
        "updatedAt": "2022-08-09T21:12:44.310Z"
    },
    {
        "createdAt": "2022-08-09T21:12:51.219Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Dome",
        "count": "0",
        "id": "7de24a8b-1cec-46bb-be35-5b8360ccfebf",
        "type": "AI",
        "updatedAt": "2022-08-09T21:12:51.219Z"
    },
    {
        "createdAt": "2022-08-09T21:13:00.560Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Buffet",
        "count": "0",
        "id": "415f8551-4c5f-4b8b-9d3a-044653648940",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:00.560Z"
    },
    {
        "createdAt": "2022-08-09T21:13:14.756Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Vase",
        "count": "0",
        "id": "13983574-249d-4baa-b311-219a4c2d81ac",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:14.756Z"
    },
    {
        "createdAt": "2022-08-09T21:13:14.756Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Jar",
        "count": "0",
        "id": "9fa88fbc-dee5-40fa-9164-f7281f662411",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:14.756Z"
    },
    {
        "createdAt": "2022-08-09T21:13:14.758Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Planter",
        "count": "0",
        "id": "bc933507-4ad7-462b-9cf1-58f8772fae38",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:14.758Z"
    },
    {
        "createdAt": "2022-08-09T21:13:14.758Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Daisy",
        "count": "0",
        "id": "8d30ccfc-d773-4804-a8fa-790a419e0e64",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:14.758Z"
    },
    {
        "createdAt": "2022-08-09T21:13:23.821Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Intersection",
        "count": "0",
        "id": "b8bbba23-006a-4424-af08-30d2d8bc06d2",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:23.821Z"
    },
    {
        "createdAt": "2022-08-09T21:13:23.821Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Downtown",
        "count": "0",
        "id": "3760327c-9825-42c5-99ac-7298cb34c0d7",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:23.821Z"
    },
    {
        "createdAt": "2022-08-09T21:13:30.456Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Patio",
        "count": "0",
        "id": "812622c3-a90a-42fe-9527-c79e42bef3bf",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:30.456Z"
    },
    {
        "createdAt": "2022-08-09T21:13:40.230Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Reservoir",
        "count": "0",
        "id": "dfcf752f-191e-46c4-98a3-0bdd1be0fd48",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:40.230Z"
    },
    {
        "createdAt": "2022-08-09T21:13:45.784Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Pub",
        "count": "0",
        "id": "7530a56c-000f-4273-bf77-aab955df24bd",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:45.784Z"
    },
    {
        "createdAt": "2022-08-09T21:13:45.785Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Bar Counter",
        "count": "0",
        "id": "2063f7e9-4980-4344-bddc-bb968e9dd6d9",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:45.785Z"
    },
    {
        "createdAt": "2022-08-09T21:13:48.977Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Lighthouse",
        "count": "0",
        "id": "0ee2bef5-af7a-4450-aa85-0087ec07ab6f",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:48.977Z"
    },
    {
        "createdAt": "2022-08-09T21:13:48.977Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Beacon",
        "count": "0",
        "id": "35d93e63-1386-4cd3-98e5-a81c4d203f90",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:48.977Z"
    },
    {
        "createdAt": "2022-08-09T21:13:48.977Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Bridge",
        "count": "0",
        "id": "bf622b27-eb5e-49f8-bf35-41ace1798633",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:48.977Z"
    },
    {
        "createdAt": "2022-08-09T21:13:51.327Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Accipiter",
        "count": "0",
        "id": "f3be9b47-20be-46ca-b18d-af7781ebab7c",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:51.327Z"
    },
    {
        "createdAt": "2022-08-09T21:13:51.327Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Hawk",
        "count": "0",
        "id": "ca455147-abbd-4eb5-9218-82a321efdc6e",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:51.327Z"
    },
    {
        "createdAt": "2022-08-09T21:13:51.327Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Buzzard",
        "count": "0",
        "id": "bd1ed518-c0d8-4a0f-b048-b91c7e0cf2cf",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:51.327Z"
    },
    {
        "createdAt": "2022-08-09T21:13:53.654Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Slope",
        "count": "0",
        "id": "8fd8e2be-7803-4c00-8ad7-8f78869ea2a8",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:53.654Z"
    },
    {
        "createdAt": "2022-08-09T21:13:53.654Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Hill",
        "count": "0",
        "id": "30eff712-954a-47ac-84a6-5c21ede72e34",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:53.654Z"
    },
    {
        "createdAt": "2022-08-09T21:13:53.655Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Countryside",
        "count": "0",
        "id": "cf253a4d-46f3-4cee-8cf4-9fb4bd4ec7a7",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:53.655Z"
    },
    {
        "createdAt": "2022-08-09T21:13:55.163Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Rainforest",
        "count": "0",
        "id": "e8c5be74-7646-4c16-8be9-3449311de1d1",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:55.163Z"
    },
    {
        "createdAt": "2022-08-09T21:13:55.163Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Stream",
        "count": "0",
        "id": "1ac6341b-687c-436f-b55d-af6b87537726",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:55.163Z"
    },
    {
        "createdAt": "2022-08-09T21:13:55.163Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Creek",
        "count": "0",
        "id": "8b4d7ead-c32b-497b-a511-efaa8ec6e1ec",
        "type": "AI",
        "updatedAt": "2022-08-09T21:13:55.163Z"
    },
    {
        "createdAt": "2022-09-08T17:53:47.337Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Shelf",
        "count": "0",
        "id": "4354f3c1-ce9c-4eac-9a2a-14de71a62f7e",
        "type": "AI",
        "updatedAt": "2022-09-08T17:53:47.337Z"
    },
    {
        "createdAt": "2022-09-08T18:12:20.874Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Rubble",
        "count": "0",
        "id": "1803e100-5dbe-44f0-ab26-e545364fa8c1",
        "type": "AI",
        "updatedAt": "2022-09-08T18:12:20.874Z"
    },
    {
        "createdAt": "2022-09-08T18:12:20.875Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Robe",
        "count": "0",
        "id": "e147f350-ab6c-41ff-90d6-6ee113126433",
        "type": "AI",
        "updatedAt": "2022-09-08T18:12:20.875Z"
    },
    {
        "createdAt": "2022-09-08T18:12:20.877Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Gown",
        "count": "0",
        "id": "e5b2be71-9c99-42ed-8353-1cba0419ab0f",
        "type": "AI",
        "updatedAt": "2022-09-08T18:12:20.877Z"
    },
    {
        "createdAt": "2023-01-19T17:38:28.454Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sea Life",
        "count": "0",
        "id": "dfb50eeb-398f-4c3c-abf4-2b6405e8bf6e",
        "type": "AI",
        "updatedAt": "2023-01-19T17:38:28.454Z"
    },
    {
        "createdAt": "2023-01-23T19:34:54.378Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Bow",
        "count": "0",
        "id": "da1e99e0-317b-4b40-98d3-bcc69dac309f",
        "type": "AI",
        "updatedAt": "2023-01-23T19:34:54.378Z"
    },
    {
        "createdAt": "2023-01-23T19:34:55.548Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Outer Space",
        "count": "0",
        "id": "61e7043c-3180-45fa-a922-3d94cf4c8b6e",
        "type": "AI",
        "updatedAt": "2023-01-23T19:34:55.548Z"
    },
    {
        "createdAt": "2023-01-26T16:40:25.400Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Clock Tower",
        "count": "0",
        "id": "bbaae45f-8a76-4551-8339-1b5de919b9b9",
        "type": "AI",
        "updatedAt": "2023-01-26T16:40:25.400Z"
    },
    {
        "createdAt": "2023-02-09T14:51:10.354Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Vest",
        "count": "0",
        "id": "dd29ed01-b1e8-4c31-8b51-7943d4149a1c",
        "type": "AI",
        "updatedAt": "2023-02-09T14:51:10.354Z"
    },
    {
        "createdAt": "2023-03-02T12:45:39.408Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cleaning",
        "count": "0",
        "id": "269cf6ef-1a17-42b1-9552-07ada3d7bb79",
        "type": "AI",
        "updatedAt": "2023-03-02T12:45:39.408Z"
    },
    {
        "createdAt": "2023-03-02T12:45:39.409Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Brush",
        "count": "0",
        "id": "11519881-42ab-4de2-9401-2e5789eb81d3",
        "type": "AI",
        "updatedAt": "2023-03-02T12:45:39.409Z"
    },
    {
        "createdAt": "2023-03-02T12:45:39.409Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Tool",
        "count": "0",
        "id": "cd6b3468-edbb-4488-b6ca-86d1f5bc68a4",
        "type": "AI",
        "updatedAt": "2023-03-02T12:45:39.409Z"
    },
    {
        "createdAt": "2023-03-22T11:55:22.949Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Rural",
        "count": "0",
        "id": "b8482ef0-baa3-45e8-8bfe-d109c2767b37",
        "type": "AI",
        "updatedAt": "2023-03-22T11:55:22.949Z"
    },
    {
        "createdAt": "2023-03-22T11:55:22.949Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Farm",
        "count": "0",
        "id": "8125d7ab-cfb5-4faa-85bf-31993156acd4",
        "type": "AI",
        "updatedAt": "2023-03-22T11:55:22.949Z"
    },
    {
        "createdAt": "2023-03-22T11:55:22.949Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Aerial View",
        "count": "0",
        "id": "b2af58b4-38d6-4a3a-820d-b0f12ef060fb",
        "type": "AI",
        "updatedAt": "2023-03-22T11:55:22.949Z"
    },
    {
        "createdAt": "2023-06-07T20:40:36.994Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Stained Wood",
        "count": "0",
        "id": "1fde6646-d58b-4d16-ada5-ecb9912e394d",
        "type": "AI",
        "updatedAt": "2023-06-07T20:40:36.994Z"
    },
    {
        "createdAt": "2023-06-07T20:40:36.995Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Foyer",
        "count": "0",
        "id": "4f51b56e-9b77-40af-be37-1d75fd92075b",
        "type": "AI",
        "updatedAt": "2023-06-07T20:40:36.995Z"
    },
    {
        "createdAt": "2022-07-28T22:05:45.286Z",
        "numberOfFiles": "1152",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Entire List",
        "count": "1152",
        "id": "4cffeae2-4d00-40df-a42d-3a00271e7c0d",
        "type": "regular",
        "updatedAt": "2022-07-28T22:05:45.286Z"
    },
    {
        "createdAt": "2023-10-06T08:05:40.085Z",
        "numberOfFiles": "205",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Utilities",
        "count": "205",
        "id": "5835e48d-1773-4b67-99e0-ca3f8f341160",
        "type": "regular",
        "updatedAt": "2023-10-06T08:05:40.085Z"
    },
    {
        "createdAt": "2021-03-11T15:24:26.890Z",
        "numberOfFiles": "151",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Images",
        "count": "151",
        "id": "2dfa0e53-5e36-4ea7-9164-4b9d7aa73c5c",
        "type": "regular",
        "updatedAt": "2021-03-11T15:24:26.890Z"
    },
    {
        "createdAt": "2022-04-22T01:24:52.804Z",
        "numberOfFiles": "147",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Test 160",
        "count": "147",
        "id": "c0982d69-c9b8-4fb9-ad4b-ac8f2cff9c2c",
        "type": "regular",
        "updatedAt": "2022-04-22T01:24:52.804Z"
    },
    {
        "createdAt": "2022-05-10T15:34:36.182Z",
        "numberOfFiles": "115",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Project Type",
        "count": "115",
        "id": "24ff3f61-a861-49bf-9ab5-7bcaf2270075",
        "type": "regular",
        "updatedAt": "2022-05-10T15:34:36.182Z"
    },
    {
        "createdAt": "2022-04-22T01:24:09.404Z",
        "numberOfFiles": "94",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Over 90",
        "count": "94",
        "id": "e56c900b-70c7-4a5e-9401-f1476edf35ac",
        "type": "regular",
        "updatedAt": "2022-04-22T01:24:09.404Z"
    },
    {
        "createdAt": "2022-04-13T16:24:57.246Z",
        "numberOfFiles": "92",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Combined",
        "count": "92",
        "id": "29db7d08-5a46-4140-b6f8-57665611b57c",
        "type": "regular",
        "updatedAt": "2022-04-13T16:24:57.246Z"
    },
    {
        "createdAt": "2022-04-13T16:26:59.581Z",
        "numberOfFiles": "87",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Eighty Nine",
        "count": "87",
        "id": "6a46a11c-2067-4b50-a9f4-3b94c111a460",
        "type": "regular",
        "updatedAt": "2022-04-13T16:26:59.581Z"
    },
    {
        "createdAt": "2021-03-11T15:22:57.407Z",
        "numberOfFiles": "84",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Content Marketing",
        "count": "84",
        "id": "5fa4128e-4916-4a8f-8cf7-a03d790e8996",
        "type": "regular",
        "updatedAt": "2021-03-11T15:22:57.407Z"
    },
    {
        "createdAt": "2022-04-13T16:27:17.145Z",
        "numberOfFiles": "84",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "ninety",
        "count": "84",
        "id": "2bcec041-36ef-461a-a62c-56ad8776afb1",
        "type": "regular",
        "updatedAt": "2022-04-13T16:27:17.145Z"
    },
    {
        "createdAt": "2022-01-28T02:26:40.143Z",
        "numberOfFiles": "83",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "SEO",
        "count": "83",
        "id": "aab06eff-ab3f-4451-b92b-50d04c6d1900",
        "type": "regular",
        "updatedAt": "2022-01-28T02:26:40.143Z"
    },
    {
        "createdAt": "2022-03-14T23:08:30.234Z",
        "numberOfFiles": "65",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "NF",
        "count": "65",
        "id": "e2d1d2b6-870a-4d5d-88fa-e18a109ef96d",
        "type": "regular",
        "updatedAt": "2022-03-14T23:08:30.234Z"
    },
    {
        "createdAt": "2022-04-13T16:22:27.789Z",
        "numberOfFiles": "65",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "NF 1",
        "count": "65",
        "id": "975e8521-21ad-4056-9e9b-f5c9527fdae5",
        "type": "regular",
        "updatedAt": "2022-04-13T16:22:27.789Z"
    },
    {
        "createdAt": "2022-05-10T15:34:37.484Z",
        "numberOfFiles": "58",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Social",
        "count": "58",
        "id": "f1d4f2bb-b370-4b66-9b07-6e345b28f0bb",
        "type": "regular",
        "updatedAt": "2022-05-10T15:34:37.484Z"
    },
    {
        "createdAt": "2022-04-27T20:15:23.571Z",
        "numberOfFiles": "45",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Approved",
        "count": "45",
        "id": "fcfb3060-4023-447a-80e9-35a55157550c",
        "type": "regular",
        "updatedAt": "2022-04-27T20:15:23.571Z"
    },
    {
        "createdAt": "2023-10-06T08:03:44.286Z",
        "numberOfFiles": "33",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Navigation",
        "count": "33",
        "id": "e4f5cfcc-220d-4548-9887-5b9fbe53bf78",
        "type": "regular",
        "updatedAt": "2023-10-06T08:03:44.286Z"
    },
    {
        "createdAt": "2022-08-01T15:56:52.018Z",
        "numberOfFiles": "30",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Dups",
        "count": "30",
        "id": "9a53b96e-618b-42b9-a66a-6cad3388594a",
        "type": "regular",
        "updatedAt": "2022-08-01T15:56:52.018Z"
    },
    {
        "createdAt": "2022-01-26T21:52:16.755Z",
        "numberOfFiles": "25",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "AU",
        "count": "25",
        "id": "e76a2476-5b95-4254-a69e-ead955d28ce4",
        "type": "regular",
        "updatedAt": "2022-01-26T21:52:16.755Z"
    },
    {
        "createdAt": "2023-01-23T19:35:06.504Z",
        "numberOfFiles": "24",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "RGB",
        "count": "24",
        "id": "e8498ce9-bf1b-4f87-81af-e933e21d194b",
        "type": "regular",
        "updatedAt": "2023-01-23T19:35:06.504Z"
    },
    {
        "createdAt": "2023-10-06T08:01:09.802Z",
        "numberOfFiles": "24",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Status",
        "count": "24",
        "id": "430809fe-5bbf-43eb-9cc7-c411b4ddcdf8",
        "type": "regular",
        "updatedAt": "2023-10-06T08:01:09.802Z"
    },
    {
        "createdAt": "2023-10-06T08:02:42.675Z",
        "numberOfFiles": "19",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Assets",
        "count": "19",
        "id": "920d343d-11c7-4daa-aa3b-561f31f4af98",
        "type": "regular",
        "updatedAt": "2023-10-06T08:02:42.675Z"
    },
    {
        "createdAt": "2023-01-23T19:34:36.564Z",
        "numberOfFiles": "16",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "CMYK",
        "count": "16",
        "id": "b07a0f13-de0c-4407-a02a-f6ac2add3d70",
        "type": "regular",
        "updatedAt": "2023-01-23T19:34:36.564Z"
    },
    {
        "createdAt": "2023-01-23T19:34:48.443Z",
        "numberOfFiles": "16",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "PNG",
        "count": "16",
        "id": "ff45da68-97be-4157-b0b7-5f36fb4aab97",
        "type": "regular",
        "updatedAt": "2023-01-23T19:34:48.443Z"
    },
    {
        "createdAt": "2023-09-06T16:23:34.918Z",
        "numberOfFiles": "16",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sparkfive Logos",
        "count": "16",
        "id": "6f20969d-05fa-41d1-89f2-716c41224044",
        "type": "regular",
        "updatedAt": "2023-09-06T16:23:34.918Z"
    },
    {
        "createdAt": "2023-10-06T08:16:07.924Z",
        "numberOfFiles": "15",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "arrow",
        "count": "15",
        "id": "9866b182-9e1f-4788-83b6-f0b2f6250cd2",
        "type": "regular",
        "updatedAt": "2023-10-06T08:16:07.924Z"
    },
    {
        "createdAt": "2021-12-08T14:58:59.441Z",
        "numberOfFiles": "14",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Training Videos",
        "count": "14",
        "id": "7f484994-3271-4661-9a98-87219f6f4342",
        "type": "regular",
        "updatedAt": "2021-12-08T14:58:59.441Z"
    },
    {
        "createdAt": "2022-01-08T21:28:18.626Z",
        "numberOfFiles": "14",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Demos",
        "count": "14",
        "id": "7944c504-329c-468b-863e-d7706e04c7da",
        "type": "regular",
        "updatedAt": "2022-01-08T21:28:18.626Z"
    },
    {
        "createdAt": "2023-10-06T07:56:56.638Z",
        "numberOfFiles": "13",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Asset Actions",
        "count": "13",
        "id": "59b81f24-885f-4a6d-bd85-e2a496c81b21",
        "type": "regular",
        "updatedAt": "2023-10-06T07:56:56.638Z"
    },
    {
        "createdAt": "2023-10-06T08:05:49.058Z",
        "numberOfFiles": "13",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Description-Edit",
        "count": "13",
        "id": "be0bd212-e0a7-4fa6-a7e4-ca4902abb9ae",
        "type": "regular",
        "updatedAt": "2023-10-06T08:05:49.058Z"
    },
    {
        "createdAt": "2022-01-26T22:02:27.169Z",
        "numberOfFiles": "12",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "AU - copia",
        "count": "12",
        "id": "d5a68107-0c68-4498-babe-5fe5b3579597",
        "type": "regular",
        "updatedAt": "2022-01-26T22:02:27.169Z"
    },
    {
        "createdAt": "2022-05-10T15:34:38.826Z",
        "numberOfFiles": "12",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Email",
        "count": "12",
        "id": "f2bcdc75-c2a2-47e7-816a-fb39db92ea11",
        "type": "regular",
        "updatedAt": "2022-05-10T15:34:38.826Z"
    },
    {
        "createdAt": "2023-10-06T08:07:04.210Z",
        "numberOfFiles": "12",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Radio Button",
        "count": "12",
        "id": "5173e1a7-faf3-4409-8cf3-8ea2cbb55314",
        "type": "regular",
        "updatedAt": "2023-10-06T08:07:04.210Z"
    },
    {
        "createdAt": "2021-02-25T22:53:54.707Z",
        "numberOfFiles": "11",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Working",
        "count": "11",
        "id": "a8ce62d9-f205-4e61-a28b-ba81be7c229c",
        "type": "regular",
        "updatedAt": "2021-02-25T22:53:54.707Z"
    },
    {
        "createdAt": "2022-01-29T13:44:36.894Z",
        "numberOfFiles": "11",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Computer Uploads",
        "count": "11",
        "id": "1072e2ba-8e4d-4a12-aa19-cf9ffcbe84fd",
        "type": "regular",
        "updatedAt": "2022-01-29T13:44:36.894Z"
    },
    {
        "createdAt": "2022-05-10T15:34:36.189Z",
        "numberOfFiles": "11",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "AD",
        "count": "11",
        "id": "36f8f2d2-5d4c-457e-bec5-5516344cb754",
        "type": "regular",
        "updatedAt": "2022-05-10T15:34:36.189Z"
    },
    {
        "createdAt": "2022-05-10T15:34:39.037Z",
        "numberOfFiles": "11",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Tasks",
        "count": "11",
        "id": "2103a2b7-793b-4711-8d79-01d29182bedd",
        "type": "regular",
        "updatedAt": "2022-05-10T15:34:39.037Z"
    },
    {
        "createdAt": "2022-05-10T15:34:44.299Z",
        "numberOfFiles": "11",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Article",
        "count": "11",
        "id": "a289a1d6-60dd-4a00-93f4-6543390858d0",
        "type": "regular",
        "updatedAt": "2022-05-10T15:34:44.299Z"
    },
    {
        "createdAt": "2022-05-10T15:34:47.803Z",
        "numberOfFiles": "11",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Campaign",
        "count": "11",
        "id": "54c036d4-679e-4567-9011-ecd4766be97c",
        "type": "regular",
        "updatedAt": "2022-05-10T15:34:47.803Z"
    },
    {
        "createdAt": "2021-09-17T14:15:24.991Z",
        "numberOfFiles": "10",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "White",
        "count": "10",
        "id": "2c6665ee-3141-440c-a378-90bd85abc348",
        "type": "regular",
        "updatedAt": "2021-09-17T14:15:24.991Z"
    },
    {
        "createdAt": "2022-05-13T20:25:55.160Z",
        "numberOfFiles": "10",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Athletics",
        "count": "10",
        "id": "e04887a8-475e-4c2c-8b7d-5333dbd1a477",
        "type": "regular",
        "updatedAt": "2022-05-13T20:25:55.160Z"
    },
    {
        "createdAt": "2023-01-23T19:34:41.148Z",
        "numberOfFiles": "10",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "EPS",
        "count": "10",
        "id": "64a51236-833a-4f2a-8266-2439fba87592",
        "type": "regular",
        "updatedAt": "2023-01-23T19:34:41.148Z"
    },
    {
        "createdAt": "2023-01-23T19:34:36.581Z",
        "numberOfFiles": "9",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "AI",
        "count": "9",
        "id": "b02542b8-6ad7-44d2-afe8-a41f40afc86a",
        "type": "regular",
        "updatedAt": "2023-01-23T19:34:36.581Z"
    },
    {
        "createdAt": "2021-02-25T22:55:16.072Z",
        "numberOfFiles": "8",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Smiling",
        "count": "8",
        "id": "f42c0036-1310-4929-8c82-f45474bd54d1",
        "type": "regular",
        "updatedAt": "2021-02-25T22:55:16.072Z"
    },
    {
        "createdAt": "2022-07-08T13:32:09.835Z",
        "numberOfFiles": "8",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Interior",
        "count": "8",
        "id": "b5db1590-6405-4483-9e76-b05f3e542914",
        "type": "regular",
        "updatedAt": "2022-07-08T13:32:09.835Z"
    },
    {
        "createdAt": "2023-10-06T08:12:28.474Z",
        "numberOfFiles": "8",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "More",
        "count": "8",
        "id": "7622c17d-22b1-4f80-bfcf-b5afad726e6d",
        "type": "regular",
        "updatedAt": "2023-10-06T08:12:28.474Z"
    },
    {
        "createdAt": "2023-10-06T08:14:27.490Z",
        "numberOfFiles": "8",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Add +",
        "count": "8",
        "id": "7a69ecb4-6243-41dd-872a-9935829954c6",
        "type": "regular",
        "updatedAt": "2023-10-06T08:14:27.490Z"
    },
    {
        "createdAt": "2023-10-06T08:15:14.544Z",
        "numberOfFiles": "8",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Delete",
        "count": "8",
        "id": "06d69652-ea32-4f58-a3d4-2d8d745192f2",
        "type": "regular",
        "updatedAt": "2023-10-06T08:15:14.544Z"
    },
    {
        "createdAt": "2021-02-25T22:53:57.574Z",
        "numberOfFiles": "7",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Team",
        "count": "7",
        "id": "de92cafd-efc4-45a8-9f8c-476eb6e379f3",
        "type": "regular",
        "updatedAt": "2021-02-25T22:53:57.574Z"
    },
    {
        "createdAt": "2021-12-08T15:00:47.111Z",
        "numberOfFiles": "7",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Tags",
        "count": "7",
        "id": "83fc2009-2ae0-40a1-875c-96c82e07befe",
        "type": "regular",
        "updatedAt": "2021-12-08T15:00:47.111Z"
    },
    {
        "createdAt": "2022-01-29T17:46:48.767Z",
        "numberOfFiles": "7",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "folder guest upload",
        "count": "7",
        "id": "ced52cbb-47ed-4e1d-a541-93e0cb8d027d",
        "type": "regular",
        "updatedAt": "2022-01-29T17:46:48.767Z"
    },
    {
        "createdAt": "2023-01-23T19:34:59.386Z",
        "numberOfFiles": "7",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Favicon",
        "count": "7",
        "id": "c48230ce-3130-4f86-a995-1d92eaa2bb42",
        "type": "regular",
        "updatedAt": "2023-01-23T19:34:59.386Z"
    },
    {
        "createdAt": "2023-09-25T13:00:00.386Z",
        "numberOfFiles": "7",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "testspark",
        "count": "7",
        "id": "049ac0ce-35de-4692-b229-1a678603f345",
        "type": "regular",
        "updatedAt": "2023-09-25T13:00:00.386Z"
    },
    {
        "createdAt": "2023-10-06T08:09:32.858Z",
        "numberOfFiles": "7",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Close Panel",
        "count": "7",
        "id": "aa4290d8-b0e0-4aab-ae95-e41cee01a7c5",
        "type": "regular",
        "updatedAt": "2023-10-06T08:09:32.858Z"
    },
    {
        "createdAt": "2023-10-06T08:10:03.574Z",
        "numberOfFiles": "7",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Comments",
        "count": "7",
        "id": "4cc9c4c4-d472-4df0-84af-8e8019277f6e",
        "type": "regular",
        "updatedAt": "2023-10-06T08:10:03.574Z"
    },
    {
        "createdAt": "2023-10-06T08:13:26.449Z",
        "numberOfFiles": "7",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "@",
        "count": "7",
        "id": "a87caf52-23b6-4210-9e4b-94eb4e167aec",
        "type": "regular",
        "updatedAt": "2023-10-06T08:13:26.449Z"
    },
    {
        "createdAt": "2023-02-09T14:51:22.488Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Bottles",
        "count": "6",
        "id": "96e67475-68c1-49cf-9058-017e092826df",
        "type": "regular",
        "updatedAt": "2023-02-09T14:51:22.488Z"
    },
    {
        "createdAt": "2023-10-06T08:01:09.826Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "All",
        "count": "6",
        "id": "7b2441c8-a84e-4e12-a8c7-6c8e9190cb47",
        "type": "regular",
        "updatedAt": "2023-10-06T08:01:09.826Z"
    },
    {
        "createdAt": "2023-10-06T08:01:31.182Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Scheduled",
        "count": "6",
        "id": "6f0378d7-6a73-4e2a-abcd-3ee4bdfa286d",
        "type": "regular",
        "updatedAt": "2023-10-06T08:01:31.182Z"
    },
    {
        "createdAt": "2023-10-06T08:01:49.922Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Complete",
        "count": "6",
        "id": "762fc474-c8dc-499c-b3a6-cc7230a330a3",
        "type": "regular",
        "updatedAt": "2023-10-06T08:01:49.922Z"
    },
    {
        "createdAt": "2023-10-06T08:02:09.018Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Drafts",
        "count": "6",
        "id": "fd8c1b46-6f7f-47a9-8c60-498cd2fc4c08",
        "type": "regular",
        "updatedAt": "2023-10-06T08:02:09.018Z"
    },
    {
        "createdAt": "2023-10-06T08:06:39.334Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Download",
        "count": "6",
        "id": "d0f5e9d8-81c5-4b95-8df1-5e31224445ed",
        "type": "regular",
        "updatedAt": "2023-10-06T08:06:39.334Z"
    },
    {
        "createdAt": "2023-10-06T08:07:46.298Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Information",
        "count": "6",
        "id": "4979a6aa-da66-49c6-9589-211e71126af6",
        "type": "regular",
        "updatedAt": "2023-10-06T08:07:46.298Z"
    },
    {
        "createdAt": "2023-10-06T08:12:59.054Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Member",
        "count": "6",
        "id": "f5db6db4-8124-4464-9352-988adf98ba93",
        "type": "regular",
        "updatedAt": "2023-10-06T08:12:59.054Z"
    },
    {
        "createdAt": "2023-10-06T08:15:42.826Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Move Folder",
        "count": "6",
        "id": "313f8380-a567-4bc1-b971-dc2c0e472bee",
        "type": "regular",
        "updatedAt": "2023-10-06T08:15:42.826Z"
    },
    {
        "createdAt": "2023-10-06T08:17:10.459Z",
        "numberOfFiles": "6",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Assign Member",
        "count": "6",
        "id": "6c27ce54-e1a9-4f58-86a3-5c8c3cc0c30c",
        "type": "regular",
        "updatedAt": "2023-10-06T08:17:10.459Z"
    },
    {
        "createdAt": "2021-02-25T22:54:04.221Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Computer",
        "count": "5",
        "id": "56a203fe-ac7b-4156-a003-4327b8fe66a0",
        "type": "regular",
        "updatedAt": "2021-02-25T22:54:04.221Z"
    },
    {
        "createdAt": "2021-02-25T22:54:23.543Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Logo",
        "count": "5",
        "id": "c17c1368-3cfc-4856-9c4c-73f09b58942c",
        "type": "regular",
        "updatedAt": "2021-02-25T22:54:23.543Z"
    },
    {
        "createdAt": "2021-02-25T22:54:58.239Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Happy",
        "count": "5",
        "id": "c5334f90-ea0f-4696-b9ca-fdb5643a2fa4",
        "type": "regular",
        "updatedAt": "2021-02-25T22:54:58.239Z"
    },
    {
        "createdAt": "2021-09-17T14:15:24.991Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sparkfive Logo",
        "count": "5",
        "id": "5170f5f9-5b74-4118-ba5d-7617ed11fd5b",
        "type": "regular",
        "updatedAt": "2021-09-17T14:15:24.991Z"
    },
    {
        "createdAt": "2022-01-10T12:41:20.048Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Tile",
        "count": "5",
        "id": "9ee83fd1-71f6-4e06-a1f4-85054bb79754",
        "type": "regular",
        "updatedAt": "2022-01-10T12:41:20.048Z"
    },
    {
        "createdAt": "2023-01-23T19:35:23.046Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "SVG",
        "count": "5",
        "id": "b80aad32-b63f-449b-8e50-bc09c8224cea",
        "type": "regular",
        "updatedAt": "2023-01-23T19:35:23.046Z"
    },
    {
        "createdAt": "2023-02-09T14:51:24.091Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Patron",
        "count": "5",
        "id": "4c154058-87af-441b-9854-f5f240a780b6",
        "type": "regular",
        "updatedAt": "2023-02-09T14:51:24.091Z"
    },
    {
        "createdAt": "2023-07-06T10:57:40.557Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "testing1234",
        "count": "5",
        "id": "8c46e8a2-3199-4e4e-a004-1767def94f1a",
        "type": "regular",
        "updatedAt": "2023-07-06T10:57:40.557Z"
    },
    {
        "createdAt": "2023-10-06T08:00:51.762Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Project",
        "count": "5",
        "id": "515f0e3c-8538-4273-a376-d3c4bb58491d",
        "type": "regular",
        "updatedAt": "2023-10-06T08:00:51.762Z"
    },
    {
        "createdAt": "2023-10-06T08:08:31.714Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Back",
        "count": "5",
        "id": "df81d474-3bfc-4913-98b1-dbdc2f218188",
        "type": "regular",
        "updatedAt": "2023-10-06T08:08:31.714Z"
    },
    {
        "createdAt": "2023-10-06T08:08:53.402Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Deadline Date",
        "count": "5",
        "id": "55191516-745d-4e01-a782-cdfb01be2b0a",
        "type": "regular",
        "updatedAt": "2023-10-06T08:08:53.402Z"
    },
    {
        "createdAt": "2023-10-06T08:09:14.146Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Print",
        "count": "5",
        "id": "6b3a4292-1de4-46c1-b3d0-d23d35abe964",
        "type": "regular",
        "updatedAt": "2023-10-06T08:09:14.146Z"
    },
    {
        "createdAt": "2023-10-06T08:10:58.826Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Close",
        "count": "5",
        "id": "c4ce74e6-4d57-4580-87ca-2148d07168b0",
        "type": "regular",
        "updatedAt": "2023-10-06T08:10:58.826Z"
    },
    {
        "createdAt": "2023-10-06T08:12:09.178Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Time",
        "count": "5",
        "id": "d014ebe7-c064-4392-9b63-3424ebff9c6f",
        "type": "regular",
        "updatedAt": "2023-10-06T08:12:09.178Z"
    },
    {
        "createdAt": "2023-10-06T08:13:50.910Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "View Grid",
        "count": "5",
        "id": "31334c21-04c9-4629-8066-d81203489c19",
        "type": "regular",
        "updatedAt": "2023-10-06T08:13:50.910Z"
    },
    {
        "createdAt": "2023-10-06T08:14:09.328Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "View List",
        "count": "5",
        "id": "493f6e4c-19d8-48b5-ba77-6fe9e37d9c58",
        "type": "regular",
        "updatedAt": "2023-10-06T08:14:09.328Z"
    },
    {
        "createdAt": "2023-10-06T08:14:56.505Z",
        "numberOfFiles": "5",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Search",
        "count": "5",
        "id": "fe497636-88ee-45ec-b8dc-6dc06490c0c7",
        "type": "regular",
        "updatedAt": "2023-10-06T08:14:56.505Z"
    },
    {
        "createdAt": "2022-01-20T18:58:34.076Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Flowers",
        "count": "4",
        "id": "1983309e-4bcc-45e4-91a4-4b98ef695021",
        "type": "regular",
        "updatedAt": "2022-01-20T18:58:34.076Z"
    },
    {
        "createdAt": "2022-01-26T14:46:40.158Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Work",
        "count": "4",
        "id": "ee1565c1-db9d-4041-9f9d-bed703a63da0",
        "type": "regular",
        "updatedAt": "2022-01-26T14:46:40.158Z"
    },
    {
        "createdAt": "2022-02-10T11:24:25.517Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Esquel",
        "count": "4",
        "id": "6e4738fd-ff33-41a2-8d4c-20db676161d2",
        "type": "regular",
        "updatedAt": "2022-02-10T11:24:25.517Z"
    },
    {
        "createdAt": "2022-03-08T16:57:07.301Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Gatos",
        "count": "4",
        "id": "41134319-e6a0-4647-b648-15195180e858",
        "type": "regular",
        "updatedAt": "2022-03-08T16:57:07.301Z"
    },
    {
        "createdAt": "2023-02-09T14:51:28.799Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Margarita",
        "count": "4",
        "id": "b773b675-107a-45fb-b2cd-c8d3ac45441d",
        "type": "regular",
        "updatedAt": "2023-02-09T14:51:28.799Z"
    },
    {
        "createdAt": "2023-04-14T02:13:30.787Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Bottom",
        "count": "4",
        "id": "4f5cb6d4-931a-4398-9b5e-4fb46da0f5f1",
        "type": "regular",
        "updatedAt": "2023-04-14T02:13:30.787Z"
    },
    {
        "createdAt": "2023-09-13T16:31:49.100Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Videos working",
        "count": "4",
        "id": "787a6092-4c72-4a08-99b2-b0df58b35021",
        "type": "regular",
        "updatedAt": "2023-09-13T16:31:49.100Z"
    },
    {
        "createdAt": "2023-09-24T13:30:24.526Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Trello",
        "count": "4",
        "id": "01e61a4a-5ec4-41a6-a4b3-7cfe7255ff4e",
        "type": "regular",
        "updatedAt": "2023-09-24T13:30:24.526Z"
    },
    {
        "createdAt": "2023-10-06T08:07:04.230Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Normal",
        "count": "4",
        "id": "f060d37e-4ab7-4a3d-bc8d-6e6ab2059c85",
        "type": "regular",
        "updatedAt": "2023-10-06T08:07:04.230Z"
    },
    {
        "createdAt": "2023-10-06T08:07:19.202Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Hover",
        "count": "4",
        "id": "cc5d8332-a985-474c-88a2-cacf59ca6f36",
        "type": "regular",
        "updatedAt": "2023-10-06T08:07:19.202Z"
    },
    {
        "createdAt": "2023-10-06T08:07:32.978Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Enabled",
        "count": "4",
        "id": "efec1bb2-00e2-495f-89bf-7a8766b37ae0",
        "type": "regular",
        "updatedAt": "2023-10-06T08:07:32.978Z"
    },
    {
        "createdAt": "2023-10-06T08:08:18.358Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "FiltersTags",
        "count": "4",
        "id": "653de1c8-8caf-4b35-9277-6bdd1b29799c",
        "type": "regular",
        "updatedAt": "2023-10-06T08:08:18.358Z"
    },
    {
        "createdAt": "2023-10-06T08:11:13.674Z",
        "numberOfFiles": "4",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Member Profile",
        "count": "4",
        "id": "59750271-10cf-4e8f-8bf0-7096a5c6c8da",
        "type": "regular",
        "updatedAt": "2023-10-06T08:11:13.674Z"
    },
    {
        "createdAt": "2021-02-25T22:54:52.880Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Shoes",
        "count": "3",
        "id": "3cf63fe2-0d90-428a-975a-d7e6145d5c69",
        "type": "regular",
        "updatedAt": "2021-02-25T22:54:52.880Z"
    },
    {
        "createdAt": "2021-08-27T13:45:21.653Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "House",
        "count": "3",
        "id": "40137349-8773-4404-bb72-88c6de4997a9",
        "type": "regular",
        "updatedAt": "2021-08-27T13:45:21.653Z"
    },
    {
        "createdAt": "2021-09-17T13:46:25.606Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Woman",
        "count": "3",
        "id": "0a9c409c-e8b5-444d-8365-8e0cc6a9f05d",
        "type": "regular",
        "updatedAt": "2021-09-17T13:46:25.606Z"
    },
    {
        "createdAt": "2021-10-15T18:33:28.208Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Hubspot ",
        "count": "3",
        "id": "795d4316-eb4e-4d9d-b469-b13a46b94264",
        "type": "regular",
        "updatedAt": "2021-10-15T18:33:28.208Z"
    },
    {
        "createdAt": "2021-12-08T14:58:59.441Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Feature Overviews",
        "count": "3",
        "id": "4238bb8e-bddb-406c-af0f-9e2c5253a7df",
        "type": "regular",
        "updatedAt": "2021-12-08T14:58:59.441Z"
    },
    {
        "createdAt": "2022-03-08T16:57:17.057Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Dogs",
        "count": "3",
        "id": "834c4943-c2ae-4ced-aa91-f49d6132398d",
        "type": "regular",
        "updatedAt": "2022-03-08T16:57:17.057Z"
    },
    {
        "createdAt": "2023-10-06T08:02:32.078Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Asset Addition",
        "count": "3",
        "id": "5e013b1f-020b-4ec1-8598-3c7b6b47b140",
        "type": "regular",
        "updatedAt": "2023-10-06T08:02:32.078Z"
    },
    {
        "createdAt": "2023-10-06T08:08:09.410Z",
        "numberOfFiles": "3",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Versions",
        "count": "3",
        "id": "a561cba5-77da-46aa-928c-efbe7dda320f",
        "type": "regular",
        "updatedAt": "2023-10-06T08:08:09.410Z"
    },
    {
        "createdAt": "2021-02-25T22:52:51.445Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Screen Recordings",
        "count": "2",
        "id": "a2436a61-6655-482d-a17b-0497319a3314",
        "type": "regular",
        "updatedAt": "2021-02-25T22:52:51.445Z"
    },
    {
        "createdAt": "2021-02-25T22:54:36.420Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Christmas",
        "count": "2",
        "id": "cf26f6fe-f226-4cb6-9658-06660546adbf",
        "type": "regular",
        "updatedAt": "2021-02-25T22:54:36.420Z"
    },
    {
        "createdAt": "2021-02-25T22:56:07.486Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Headshot",
        "count": "2",
        "id": "3e481eed-19a4-4720-a3f7-aa8a774733dd",
        "type": "regular",
        "updatedAt": "2021-02-25T22:56:07.486Z"
    },
    {
        "createdAt": "2021-07-22T12:58:57.411Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Marketing",
        "count": "2",
        "id": "f94b6d15-c184-407e-ac30-53edd28d4a6d",
        "type": "regular",
        "updatedAt": "2021-07-22T12:58:57.411Z"
    },
    {
        "createdAt": "2021-10-15T18:33:32.926Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "wordpress",
        "count": "2",
        "id": "b64aefec-fde5-492e-ae13-85ba37de0c06",
        "type": "regular",
        "updatedAt": "2021-10-15T18:33:32.926Z"
    },
    {
        "createdAt": "2021-10-15T18:33:41.667Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Medium",
        "count": "2",
        "id": "fc2ee183-bdb8-4004-8ef2-9f34be40d781",
        "type": "regular",
        "updatedAt": "2021-10-15T18:33:41.667Z"
    },
    {
        "createdAt": "2021-12-08T14:59:14.918Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Admin",
        "count": "2",
        "id": "64149da4-07d4-417a-a7d3-7548b193f7c1",
        "type": "regular",
        "updatedAt": "2021-12-08T14:59:14.918Z"
    },
    {
        "createdAt": "2021-12-17T12:15:28.315Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Fashion",
        "count": "2",
        "id": "0d69bd1a-5169-4da5-aed5-15351717553d",
        "type": "regular",
        "updatedAt": "2021-12-17T12:15:28.315Z"
    },
    {
        "createdAt": "2022-01-02T15:03:34.669Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Photoshop",
        "count": "2",
        "id": "c7b118ec-090c-44d7-8c37-03185c02a81b",
        "type": "regular",
        "updatedAt": "2022-01-02T15:03:34.669Z"
    },
    {
        "createdAt": "2022-01-08T21:27:25.583Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Hills",
        "count": "2",
        "id": "9c0f87b3-40da-452c-9108-99c1db8d559d",
        "type": "regular",
        "updatedAt": "2022-01-08T21:27:25.583Z"
    },
    {
        "createdAt": "2022-01-08T21:29:49.861Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Animation",
        "count": "2",
        "id": "078fc430-6e89-448d-b8a5-5007c80b048e",
        "type": "regular",
        "updatedAt": "2022-01-08T21:29:49.861Z"
    },
    {
        "createdAt": "2022-01-08T21:37:59.199Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cycling",
        "count": "2",
        "id": "51daf6d8-510b-46fe-9d14-a7b5be789794",
        "type": "regular",
        "updatedAt": "2022-01-08T21:37:59.199Z"
    },
    {
        "createdAt": "2022-01-29T14:30:52.508Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Dropbox",
        "count": "2",
        "id": "f0eb6b99-6bac-4d23-a4c5-dca71c9ff331",
        "type": "regular",
        "updatedAt": "2022-01-29T14:30:52.508Z"
    },
    {
        "createdAt": "2022-03-02T11:55:23.779Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "000 collect",
        "count": "2",
        "id": "70af4516-14b6-447f-a3dc-0fb02abba5af",
        "type": "regular",
        "updatedAt": "2022-03-02T11:55:23.779Z"
    },
    {
        "createdAt": "2023-03-06T16:58:09.649Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "March 2023",
        "count": "2",
        "id": "f9ed6ea2-88f6-4662-ac14-1f26f0443d30",
        "type": "regular",
        "updatedAt": "2023-03-06T16:58:09.649Z"
    },
    {
        "createdAt": "2023-04-14T15:21:10.441Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Subfolder Test",
        "count": "2",
        "id": "316975e1-232e-40d4-9b76-acdc3b97771c",
        "type": "regular",
        "updatedAt": "2023-04-14T15:21:10.441Z"
    },
    {
        "createdAt": "2023-05-19T10:44:27.324Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "abc",
        "count": "2",
        "id": "a07f509a-1ac1-443e-b419-d029dbb63c21",
        "type": "regular",
        "updatedAt": "2023-05-19T10:44:27.324Z"
    },
    {
        "createdAt": "2023-05-30T21:15:44.285Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Beardbrand",
        "count": "2",
        "id": "6910ddfc-6182-438c-86e7-63e9dc24ee14",
        "type": "regular",
        "updatedAt": "2023-05-30T21:15:44.285Z"
    },
    {
        "createdAt": "2023-07-18T12:16:52.776Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Scary",
        "count": "2",
        "id": "4198b8a5-67f5-4cb3-973e-38840caa3ef3",
        "type": "regular",
        "updatedAt": "2023-07-18T12:16:52.776Z"
    },
    {
        "createdAt": "2023-08-23T22:14:35.149Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "test delete",
        "count": "2",
        "id": "f8367366-a3ad-4391-a09c-123eca133d89",
        "type": "regular",
        "updatedAt": "2023-08-23T22:14:35.149Z"
    },
    {
        "createdAt": "2023-10-06T08:05:43.426Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "EmbedCDN",
        "count": "2",
        "id": "2ca4bd8e-4cc1-4ac8-9121-4ace39f67091",
        "type": "regular",
        "updatedAt": "2023-10-06T08:05:43.426Z"
    },
    {
        "createdAt": "2023-10-06T08:09:56.762Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Notes",
        "count": "2",
        "id": "fd95d5ce-bfaa-409d-9910-d5beac013dba",
        "type": "regular",
        "updatedAt": "2023-10-06T08:09:56.762Z"
    },
    {
        "createdAt": "2023-10-06T08:13:20.338Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Filter",
        "count": "2",
        "id": "0e10818a-7c3a-410f-8494-f20e2f5eb08f",
        "type": "regular",
        "updatedAt": "2023-10-06T08:13:20.338Z"
    },
    {
        "createdAt": "2023-10-06T08:17:03.911Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Lock",
        "count": "2",
        "id": "c828bcdb-aeb8-4249-836c-4db00ee0dc9f",
        "type": "regular",
        "updatedAt": "2023-10-06T08:17:03.911Z"
    },
    {
        "createdAt": "2023-10-06T08:17:37.154Z",
        "numberOfFiles": "2",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Related",
        "count": "2",
        "id": "d28190b5-646a-4f60-be37-986a4864d5e6",
        "type": "regular",
        "updatedAt": "2023-10-06T08:17:37.154Z"
    },
    {
        "createdAt": "2021-02-25T22:55:37.677Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Meeting",
        "count": "1",
        "id": "b13cfad9-83ac-4032-8597-fbadd61b36c7",
        "type": "regular",
        "updatedAt": "2021-02-25T22:55:37.677Z"
    },
    {
        "createdAt": "2021-02-25T22:55:50.683Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cupcakes",
        "count": "1",
        "id": "e040048c-9397-4d54-a869-8ae2ab312440",
        "type": "regular",
        "updatedAt": "2021-02-25T22:55:50.683Z"
    },
    {
        "createdAt": "2021-02-25T22:56:00.572Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Hand",
        "count": "1",
        "id": "4f986c09-e570-4f76-b0d4-63bc160b5a49",
        "type": "regular",
        "updatedAt": "2021-02-25T22:56:00.572Z"
    },
    {
        "createdAt": "2021-02-25T22:56:10.161Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Man",
        "count": "1",
        "id": "5b87fb50-ad1e-4eaa-8265-c7347354d8c3",
        "type": "regular",
        "updatedAt": "2021-02-25T22:56:10.161Z"
    },
    {
        "createdAt": "2021-07-20T20:20:36.363Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sales Collateral",
        "count": "1",
        "id": "92132406-7a31-4273-92a4-09725b6cd04d",
        "type": "regular",
        "updatedAt": "2021-07-20T20:20:36.363Z"
    },
    {
        "createdAt": "2021-10-01T15:37:00.443Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sparkfive",
        "count": "1",
        "id": "c5c55b28-2e90-4990-bd56-0a4e9d56f284",
        "type": "regular",
        "updatedAt": "2021-10-01T15:37:00.443Z"
    },
    {
        "createdAt": "2021-10-15T18:34:45.688Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Integrations",
        "count": "1",
        "id": "4c545d05-2f22-4dd0-95ab-0a0c766f4f2e",
        "type": "regular",
        "updatedAt": "2021-10-15T18:34:45.688Z"
    },
    {
        "createdAt": "2021-10-22T14:54:47.274Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "File",
        "count": "1",
        "id": "2f3bd3b0-17e1-4f77-ba9c-de44d66a084c",
        "type": "regular",
        "updatedAt": "2021-10-22T14:54:47.274Z"
    },
    {
        "createdAt": "2021-11-03T15:43:28.486Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "birds",
        "count": "1",
        "id": "c1b8325a-4ad7-4206-9a07-dd3b613f6581",
        "type": "regular",
        "updatedAt": "2021-11-03T15:43:28.486Z"
    },
    {
        "createdAt": "2021-12-08T14:59:45.298Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Collection Management",
        "count": "1",
        "id": "43055875-af12-4399-9b67-61c8e3530226",
        "type": "regular",
        "updatedAt": "2021-12-08T14:59:45.298Z"
    },
    {
        "createdAt": "2021-12-08T14:59:59.710Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Files into Multiple Collections",
        "count": "1",
        "id": "b4c034fb-16b7-40f3-9157-dd4f3e6ffac3",
        "type": "regular",
        "updatedAt": "2021-12-08T14:59:59.710Z"
    },
    {
        "createdAt": "2021-12-08T15:00:10.343Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Manage Deleted Assets",
        "count": "1",
        "id": "9cf7cba7-a000-420f-8ebe-13923349f0e5",
        "type": "regular",
        "updatedAt": "2021-12-08T15:00:10.343Z"
    },
    {
        "createdAt": "2021-12-08T15:00:47.111Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Campaigns",
        "count": "1",
        "id": "cc966c5e-7f86-48e9-9e04-cd1ddeb2dc1d",
        "type": "regular",
        "updatedAt": "2021-12-08T15:00:47.111Z"
    },
    {
        "createdAt": "2021-12-08T15:00:47.112Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Products",
        "count": "1",
        "id": "ca6a2739-221c-40be-b691-8891ed01e80f",
        "type": "regular",
        "updatedAt": "2021-12-08T15:00:47.112Z"
    },
    {
        "createdAt": "2021-12-08T15:00:47.113Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Collections",
        "count": "1",
        "id": "f62835fe-acc9-4cfb-a61f-08a188d19997",
        "type": "regular",
        "updatedAt": "2021-12-08T15:00:47.113Z"
    },
    {
        "createdAt": "2021-12-16T16:09:39.890Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Green",
        "count": "1",
        "id": "d0b12d88-cfe4-4206-8285-8884e2036bf7",
        "type": "regular",
        "updatedAt": "2021-12-16T16:09:39.890Z"
    },
    {
        "createdAt": "2021-12-17T12:14:49.495Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sunglasses",
        "count": "1",
        "id": "bdaecf9c-f7f7-4ed4-82f5-181416801ed8",
        "type": "regular",
        "updatedAt": "2021-12-17T12:14:49.495Z"
    },
    {
        "createdAt": "2022-01-08T21:27:30.336Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Ocean",
        "count": "1",
        "id": "d797ed40-f368-4c6f-952b-5ae60bf49b9f",
        "type": "regular",
        "updatedAt": "2022-01-08T21:27:30.336Z"
    },
    {
        "createdAt": "2022-01-08T21:27:46.471Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Hiking",
        "count": "1",
        "id": "6fbdb78c-a90b-4582-88f3-81d279727d75",
        "type": "regular",
        "updatedAt": "2022-01-08T21:27:46.471Z"
    },
    {
        "createdAt": "2022-01-08T21:27:55.615Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Forrest",
        "count": "1",
        "id": "0514e268-bd20-41d4-95c5-3b768407804b",
        "type": "regular",
        "updatedAt": "2022-01-08T21:27:55.615Z"
    },
    {
        "createdAt": "2022-01-19T20:33:42.637Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Linkedin",
        "count": "1",
        "id": "a80ffc6b-58d3-4c3a-9ac5-287c580fe0e3",
        "type": "regular",
        "updatedAt": "2022-01-19T20:33:42.637Z"
    },
    {
        "createdAt": "2022-01-19T20:33:51.679Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Social Media",
        "count": "1",
        "id": "dc87ef1f-0ac2-4d24-bb9f-b7f9277a2733",
        "type": "regular",
        "updatedAt": "2022-01-19T20:33:51.679Z"
    },
    {
        "createdAt": "2022-01-20T20:42:17.097Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "tulipan",
        "count": "1",
        "id": "bd76a0ca-6bde-4471-ae9f-7c775533368a",
        "type": "regular",
        "updatedAt": "2022-01-20T20:42:17.097Z"
    },
    {
        "createdAt": "2022-01-20T20:42:42.103Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "colorful",
        "count": "1",
        "id": "d73b0a81-b8e0-4623-9047-8f4f62015b71",
        "type": "regular",
        "updatedAt": "2022-01-20T20:42:42.103Z"
    },
    {
        "createdAt": "2022-01-28T14:45:54.525Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "deleted collecion",
        "count": "1",
        "id": "c3fe8f62-83c5-4b03-88d7-b0ec409661d0",
        "type": "regular",
        "updatedAt": "2022-01-28T14:45:54.525Z"
    },
    {
        "createdAt": "2022-03-01T22:32:02.704Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "labrador",
        "count": "1",
        "id": "2617e9fb-e60b-4ba8-9de0-560034235672",
        "type": "regular",
        "updatedAt": "2022-03-01T22:32:02.704Z"
    },
    {
        "createdAt": "2022-03-08T16:55:54.325Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "word",
        "count": "1",
        "id": "10e01f9b-5a7d-407b-b58c-731419e02497",
        "type": "regular",
        "updatedAt": "2022-03-08T16:55:54.325Z"
    },
    {
        "createdAt": "2022-03-08T16:57:06.314Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Nueva carpeta",
        "count": "1",
        "id": "0ffd56d0-20d6-4260-b8c3-695faecaf6aa",
        "type": "regular",
        "updatedAt": "2022-03-08T16:57:06.314Z"
    },
    {
        "createdAt": "2022-04-11T20:35:53.517Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Check Icon",
        "count": "1",
        "id": "39a0a208-9fbc-4cf3-bfe0-0d5a2caf0cdf",
        "type": "regular",
        "updatedAt": "2022-04-11T20:35:53.517Z"
    },
    {
        "createdAt": "2022-05-02T14:28:11.672Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Adobe Plugin",
        "count": "1",
        "id": "cdbae9ae-13a2-4451-abdc-50a909ff42e2",
        "type": "regular",
        "updatedAt": "2022-05-02T14:28:11.672Z"
    },
    {
        "createdAt": "2022-07-19T10:49:36.372Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "canine",
        "count": "1",
        "id": "da6e46f1-2e3c-466c-a192-bda3a7e90ebc",
        "type": "regular",
        "updatedAt": "2022-07-19T10:49:36.372Z"
    },
    {
        "createdAt": "2022-07-19T20:22:42.657Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Space   ",
        "count": "1",
        "id": "fae2e795-39e3-499f-94a4-79464bbbb01e",
        "type": "regular",
        "updatedAt": "2022-07-19T20:22:42.657Z"
    },
    {
        "createdAt": "2022-08-03T07:56:03.369Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "folder-b",
        "count": "1",
        "id": "c7917421-624f-4fbb-bbe1-ec769a4d0877",
        "type": "regular",
        "updatedAt": "2022-08-03T07:56:03.369Z"
    },
    {
        "createdAt": "2022-08-03T07:56:06.350Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "folder-c",
        "count": "1",
        "id": "8c3c3a82-d224-4049-b0d3-2f0560e70271",
        "type": "regular",
        "updatedAt": "2022-08-03T07:56:06.350Z"
    },
    {
        "createdAt": "2023-01-23T19:34:52.637Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "customer logos",
        "count": "1",
        "id": "e52115b2-ffda-42e1-b572-825791e15457",
        "type": "regular",
        "updatedAt": "2023-01-23T19:34:52.637Z"
    },
    {
        "createdAt": "2023-02-09T14:51:23.412Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Casamigos",
        "count": "1",
        "id": "f9fd905c-db34-4bba-91f6-9ef843226856",
        "type": "regular",
        "updatedAt": "2023-02-09T14:51:23.412Z"
    },
    {
        "createdAt": "2023-04-10T14:50:47.272Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Sleeping Bag",
        "count": "1",
        "id": "0b4a31df-44a1-403e-9055-e45a955f7af6",
        "type": "regular",
        "updatedAt": "2023-04-10T14:50:47.272Z"
    },
    {
        "createdAt": "2023-04-28T22:00:40.375Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Totally New Tag",
        "count": "1",
        "id": "d827445f-fb3d-44a5-b365-aab51cbc3061",
        "type": "regular",
        "updatedAt": "2023-04-28T22:00:40.375Z"
    },
    {
        "createdAt": "2023-04-28T22:01:06.745Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "yoda",
        "count": "1",
        "id": "a14509a0-6ea8-4929-8191-e82c56bb2a21",
        "type": "regular",
        "updatedAt": "2023-04-28T22:01:06.745Z"
    },
    {
        "createdAt": "2023-04-29T13:39:44.637Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "New one for example",
        "count": "1",
        "id": "a428ebbd-bf3f-40b5-823e-bb785c694d1e",
        "type": "regular",
        "updatedAt": "2023-04-29T13:39:44.637Z"
    },
    {
        "createdAt": "2023-04-29T13:40:17.810Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Labtop",
        "count": "1",
        "id": "4656872b-b909-4d24-ad61-b16151c34f34",
        "type": "regular",
        "updatedAt": "2023-04-29T13:40:17.810Z"
    },
    {
        "createdAt": "2023-05-01T13:33:44.834Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Cine",
        "count": "1",
        "id": "045be61a-b03b-4e8c-8178-a8c38fb2b3d2",
        "type": "regular",
        "updatedAt": "2023-05-01T13:33:44.834Z"
    },
    {
        "createdAt": "2023-05-01T13:33:57.426Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Tor",
        "count": "1",
        "id": "7a9e19d4-d844-4ccb-9fe9-a633ba62574c",
        "type": "regular",
        "updatedAt": "2023-05-01T13:33:57.426Z"
    },
    {
        "createdAt": "2023-05-02T07:04:52.458Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "tyier",
        "count": "1",
        "id": "81e3689d-eae5-401d-b9f7-df0bee596b86",
        "type": "regular",
        "updatedAt": "2023-05-02T07:04:52.458Z"
    },
    {
        "createdAt": "2023-05-05T10:01:33.573Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "adult",
        "count": "1",
        "id": "b5a26c21-f3a2-457b-b172-01b189ed8e03",
        "type": "regular",
        "updatedAt": "2023-05-05T10:01:33.573Z"
    },
    {
        "createdAt": "2023-05-12T20:35:07.910Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Onboarding",
        "count": "1",
        "id": "b695624c-e3f4-4d91-b4de-566d18bb2b5f",
        "type": "regular",
        "updatedAt": "2023-05-12T20:35:07.910Z"
    },
    {
        "createdAt": "2023-05-12T20:36:13.392Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Product Development",
        "count": "1",
        "id": "e23c46b4-4572-4a89-b047-530d37661a86",
        "type": "regular",
        "updatedAt": "2023-05-12T20:36:13.392Z"
    },
    {
        "createdAt": "2023-05-19T10:44:42.196Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "xcv",
        "count": "1",
        "id": "f26819c3-e4cb-4890-a3ed-6f9b937bcb9e",
        "type": "regular",
        "updatedAt": "2023-05-19T10:44:42.196Z"
    },
    {
        "createdAt": "2023-05-19T10:45:48.190Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "opli",
        "count": "1",
        "id": "a7d1363a-4aaf-467a-b4a2-c158d3c48f1f",
        "type": "regular",
        "updatedAt": "2023-05-19T10:45:48.190Z"
    },
    {
        "createdAt": "2023-05-24T22:21:03.265Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "AWS",
        "count": "1",
        "id": "5b2a9885-b7be-4df5-954d-ad330d09517f",
        "type": "regular",
        "updatedAt": "2023-05-24T22:21:03.265Z"
    },
    {
        "createdAt": "2023-07-12T10:43:22.444Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "mp4 check",
        "count": "1",
        "id": "f57f7e62-8d89-4eac-8255-1c96332744a5",
        "type": "regular",
        "updatedAt": "2023-07-12T10:43:22.444Z"
    },
    {
        "createdAt": "2023-09-13T16:21:56.423Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "ARW",
        "count": "1",
        "id": "320a3937-0e2a-45c2-b6d3-491f14ec8816",
        "type": "regular",
        "updatedAt": "2023-09-13T16:21:56.423Z"
    },
    {
        "createdAt": "2023-10-06T08:05:37.122Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "External",
        "count": "1",
        "id": "e5e5e2cf-8399-4023-9c34-aa9d18d55c65",
        "type": "regular",
        "updatedAt": "2023-10-06T08:05:37.122Z"
    },
    {
        "createdAt": "2023-10-06T08:06:36.742Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Transcript",
        "count": "1",
        "id": "fe5ff3da-971a-47eb-b307-79953506e042",
        "type": "regular",
        "updatedAt": "2023-10-06T08:06:36.742Z"
    },
    {
        "createdAt": "2023-10-06T08:07:00.290Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Caret",
        "count": "1",
        "id": "6207255c-7dc8-41ba-a753-a31beb2b3ec1",
        "type": "regular",
        "updatedAt": "2023-10-06T08:07:00.290Z"
    },
    {
        "createdAt": "2023-10-06T08:08:49.358Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "CheckMark",
        "count": "1",
        "id": "949e5b68-96aa-4fb7-9218-9f1b14d71fd3",
        "type": "regular",
        "updatedAt": "2023-10-06T08:08:49.358Z"
    },
    {
        "createdAt": "2023-10-06T08:09:10.942Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Share",
        "count": "1",
        "id": "898af77c-b3ab-48a5-b635-3d9d5dabba3e",
        "type": "regular",
        "updatedAt": "2023-10-06T08:09:10.942Z"
    },
    {
        "createdAt": "2023-10-06T08:10:50.638Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Thumbs Up",
        "count": "1",
        "id": "d57748cd-318b-44d8-8765-000479361ccb",
        "type": "regular",
        "updatedAt": "2023-10-06T08:10:50.638Z"
    },
    {
        "createdAt": "2023-10-06T08:10:55.918Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "X-Mark",
        "count": "1",
        "id": "5549706a-4bd5-4979-8194-32679729f591",
        "type": "regular",
        "updatedAt": "2023-10-06T08:10:55.918Z"
    },
    {
        "createdAt": "2023-10-06T08:12:56.248Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Check",
        "count": "1",
        "id": "f8954247-6154-44bc-994e-55e225f120ae",
        "type": "regular",
        "updatedAt": "2023-10-06T08:12:56.248Z"
    },
    {
        "createdAt": "2023-10-06T08:17:00.552Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Hide",
        "count": "1",
        "id": "118f1508-6d40-42a3-8627-f6bc4f01bcde",
        "type": "regular",
        "updatedAt": "2023-10-06T08:17:00.552Z"
    },
    {
        "createdAt": "2023-10-06T08:17:33.845Z",
        "numberOfFiles": "1",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Ellipse",
        "count": "1",
        "id": "2eb5f9cd-3281-4f2a-8e5f-f92018409e29",
        "type": "regular",
        "updatedAt": "2023-10-06T08:17:33.845Z"
    },
    {
        "createdAt": "2021-09-01T19:48:02.113Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Food",
        "count": "0",
        "id": "cb13612a-6acc-4e90-9f6a-d015fa414e45",
        "type": "regular",
        "updatedAt": "2021-09-01T19:48:02.113Z"
    },
    {
        "createdAt": "2021-11-03T00:09:03.975Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "test",
        "count": "0",
        "id": "91baa6c9-f4e9-46c3-8989-09d4c1a4ec23",
        "type": "regular",
        "updatedAt": "2021-11-03T00:09:03.975Z"
    },
    {
        "createdAt": "2022-01-08T21:28:03.620Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Kayaking",
        "count": "0",
        "id": "fbee2ee9-8bc9-44f0-a0d8-c3d76f46d908",
        "type": "regular",
        "updatedAt": "2022-01-08T21:28:03.620Z"
    },
    {
        "createdAt": "2022-01-21T11:49:33.355Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "video",
        "count": "0",
        "id": "29b12b54-84fc-42c1-90d1-261c1b607b04",
        "type": "regular",
        "updatedAt": "2022-01-21T11:49:33.355Z"
    },
    {
        "createdAt": "2022-01-21T12:23:42.292Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "varios",
        "count": "0",
        "id": "3c7fd69c-83d6-44c9-bf48-a52444c1dec1",
        "type": "regular",
        "updatedAt": "2022-01-21T12:23:42.292Z"
    },
    {
        "createdAt": "2022-01-25T21:37:23.494Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "1111",
        "count": "0",
        "id": "e7667a8c-8ac7-49e9-8c22-c1741361f1b2",
        "type": "regular",
        "updatedAt": "2022-01-25T21:37:23.494Z"
    },
    {
        "createdAt": "2022-01-29T15:14:57.352Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "yellow",
        "count": "0",
        "id": "ad36bd7d-be91-402e-9bf8-5b3ecb6e5acb",
        "type": "regular",
        "updatedAt": "2022-01-29T15:14:57.352Z"
    },
    {
        "createdAt": "2022-03-01T22:30:47.523Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "boxer",
        "count": "0",
        "id": "7f7fe6f9-81c6-4bff-b5f2-f3294d2b8381",
        "type": "regular",
        "updatedAt": "2022-03-01T22:30:47.523Z"
    },
    {
        "createdAt": "2022-08-09T21:09:27.316Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "New bulk tag",
        "count": "0",
        "id": "334a9d92-f599-46ae-804f-15a609cc61de",
        "type": "regular",
        "updatedAt": "2022-08-09T21:09:27.316Z"
    },
    {
        "createdAt": "2022-08-09T21:14:21.306Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "8 nine test batch",
        "count": "0",
        "id": "8b05d878-48df-42fe-ac58-9186f1b07c34",
        "type": "regular",
        "updatedAt": "2022-08-09T21:14:21.306Z"
    },
    {
        "createdAt": "2022-08-09T21:15:13.161Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Aug nine batch",
        "count": "0",
        "id": "65de42df-4c0e-43cd-9c56-266a344703f0",
        "type": "regular",
        "updatedAt": "2022-08-09T21:15:13.161Z"
    },
    {
        "createdAt": "2023-03-02T12:47:11.826Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "SCD",
        "count": "0",
        "id": "09d20828-355c-41d2-91de-9e8698d4e70d",
        "type": "regular",
        "updatedAt": "2023-03-02T12:47:11.826Z"
    },
    {
        "createdAt": "2023-03-22T07:18:52.887Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "bike",
        "count": "0",
        "id": "537c18e0-9754-42b0-a7a6-ce2bf3e3f806",
        "type": "regular",
        "updatedAt": "2023-03-22T07:18:52.887Z"
    },
    {
        "createdAt": "2023-04-10T08:15:54.765Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "testapr",
        "count": "0",
        "id": "ac8a254e-5a79-4fc8-8002-155e2cb7ff28",
        "type": "regular",
        "updatedAt": "2023-04-10T08:15:54.765Z"
    },
    {
        "createdAt": "2023-05-24T22:19:34.089Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "cloudwatch",
        "count": "0",
        "id": "789b6567-e77c-40e7-97d3-ad19d80fa4c8",
        "type": "regular",
        "updatedAt": "2023-05-24T22:19:34.089Z"
    },
    {
        "createdAt": "2023-05-25T11:44:51.161Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Syrup Cakes",
        "count": "0",
        "id": "82eea8d6-e13e-4c26-8da4-ce9ad8349f9c",
        "type": "regular",
        "updatedAt": "2023-05-25T11:44:51.161Z"
    },
 
    {
        "createdAt": "2023-05-25T11:45:21.960Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Meals",
        "count": "0",
        "id": "68b710cc-c6d7-4e81-87d0-9c39a0ddb1e0",
        "type": "regular",
        "updatedAt": "2023-05-25T11:45:21.960Z"
    },
    {
        "createdAt": "2023-05-25T11:46:28.970Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "RedApple",
        "count": "0",
        "id": "3f17c9b8-f7c8-4c13-8265-a7d3c5e188cc",
        "type": "regular",
        "updatedAt": "2023-05-25T11:46:28.970Z"
    },
    {
        "createdAt": "2023-05-26T03:05:02.971Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "luffy",
        "count": "0",
        "id": "5938fb05-0de0-48aa-ad61-0d29e595f10d",
        "type": "regular",
        "updatedAt": "2023-05-26T03:05:02.971Z"
    },
    {
        "createdAt": "2023-08-23T22:15:32.817Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "Test Delete 2",
        "count": "0",
        "id": "35d02ee0-2483-4963-b007-0782a3768ce5",
        "type": "regular",
        "updatedAt": "2023-08-23T22:15:32.817Z"
    },
    {
        "createdAt": "2023-09-07T08:48:33.808Z",
        "numberOfFiles": "0",
        "teamId": "ca6dea66-db50-41df-89bd-ebdf41a70826",
        "name": "ghfdgd",
        "count": "0",
        "id": "29faeaaf-4fdf-425a-b12d-e9fd159bac37",
        "type": "regular",
        "updatedAt": "2023-09-07T08:48:33.808Z"
    }
]); //TODO: define type
  const [showAttrValues, setShowAttrValues] = useState<boolean>(false);

  //TODO: move it to parent level
  const getAttributes = async () => {
    try {
      const res = await teamApi.getTeamAttributes();
      setAttrs(res.data.data);
    } catch (err) {
      console.log("[GET_ATTRIBUTES]: ", err);
    }
  };

  //TODO: move it to parent level
  useEffect(() => {
    getAttributes();
  }, []);

  console.log('coming inside filter view')

  const onAttributeClick = async (data: IAttribute) => {
    let values = [];

    if (data.type === "pre-defined") {
      if (data.id === "tags") {
        const res = await tagsApi.getTags({ includeAi: false });
        values = res.data;
      } else if (data.id === "aiTags") {
        const res = await tagsApi.getTags({ includeAi: true });
        values = res.data.filter((tag) => tag.type === "AI");
      } else {
      }
      console.log("handling pre-defined attributes..........");
    } else {
      console.log("handling custom attributes..........");
    }
    setValues(values);
    setShowAttrValues(true);
  };

  return (
    <div>
    <div
    className={`${styles['outer-wrapper']}`}
    >
      {attrs.map((attr) => {
        return (
          <div>
            <div
            className={`${styles['inner-wrapper']}`}
              key={attr.id}
              onClick={(e) => {
                onAttributeClick(attr);
              }}
            >
              {attr.name}
            <img className={`${styles['arrow-down']}`} src={Utilities.downIcon} alt="" />
            </div>
          </div>
        );
      })}
      </div>
      {showAttrValues && 
         <FilterOptionPopup />
    }
    </div>
  );
};

export default FilterView;
