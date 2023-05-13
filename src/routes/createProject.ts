import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createProject } from '../database/dynamoDB';
import { errorResponse, successResponse } from '../utils/response';
import { Project } from '../models';

export const createProjectHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = JSON.parse(event.body || '{}');

    if (!projectData || Object.keys(projectData).length === 0) {
      return errorResponse(400, 'Project data is required');
    }

    const newProject = await createProject(projectData);
    return successResponse(201, newProject);
  } catch (err) {
    console.log(err);
    return errorResponse(500, 'An error occurred while creating the project');
  }
};
