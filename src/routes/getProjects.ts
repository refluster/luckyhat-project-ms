import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getProjects } from '../database/dynamoDB';
import { errorResponse, successResponse } from '../utils/response';

export const getProjectsHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const projects = await getProjects();
    return successResponse(200, projects);
  } catch (err) {
    console.log(err);
    return errorResponse(500, 'An error occurred while retrieving projects');
  }
};
