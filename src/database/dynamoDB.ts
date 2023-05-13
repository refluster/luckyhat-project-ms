// src/database/dynamoDB.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { Project } from '../models/';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({});
const dynamoDB = DynamoDBDocumentClient.from(client);
const tableName = 'luckyhat-project';

export const createProject = async (_project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
  const project: Project = {
    ..._project,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const params = {
    TableName: tableName,
    Item: project,
  };
  await dynamoDB.send(new PutCommand(params));
  return project;
};

export const getProject = async (id: string): Promise<Project | null> => {
  const params = {
    TableName: tableName,
    Key: { id },
  };
  const { Item } = await dynamoDB.send(new GetCommand(params));
  return Item ? (Item as Project) : null;
};

export const getProjects = async (): Promise<Project[]> => {
  const params = {
    TableName: tableName,
  };
  const { Items } = await dynamoDB.send(new ScanCommand(params));
  return (Items as Project[]) || [];
};

export const updateProject = async (id: string, updateData: Partial<Project>): Promise<Project | null> => {
  const updateExpression: string[] = [];
  const expressionAttributeNames: { [key: string]: string } = {};
  const expressionAttributeValues: { [key: string]: any } = {};

  for (const key in updateData) {
    if (key !== 'id' && key !== 'updatedAt') {
      const projectKey = key as keyof Project; // Assert the type of 'key' as a key of the Project type
      updateExpression.push(`#${projectKey} = :${projectKey}`);
      expressionAttributeNames[`#${projectKey}`] = projectKey;
      expressionAttributeValues[`:${projectKey}`] = updateData[projectKey];
    }
  }

  // Add updatedAt to updateExpression, expressionAttributeNames, and expressionAttributeValues
  updateExpression.push('#updatedAt = :updatedAt');
  expressionAttributeNames['#updatedAt'] = 'updatedAt';
  expressionAttributeValues[':updatedAt'] = new Date().toISOString();

  const params = {
    TableName: tableName,
    Key: { id },
    UpdateExpression: `SET ${updateExpression.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  };

  const { Attributes } = await dynamoDB.send(new UpdateCommand(params));
  return Attributes ? (Attributes as Project) : null;
};

export const deleteProject = async (id: string): Promise<void> => {
  const params = {
    TableName: tableName,
    Key: { id },
  };
  await dynamoDB.send(new DeleteCommand(params));
};
