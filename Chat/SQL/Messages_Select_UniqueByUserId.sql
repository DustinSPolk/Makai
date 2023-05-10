USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Select_UniqueByUserId]    Script Date: 5/10/2023 12:01:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Dustin Polk
-- Create date: 03-29-2023
-- Description: Select Only Users in Conversation With UserId
-- Code Reviewer: Osein Solkin

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

ALTER proc [dbo].[Messages_Select_UniqueByUserId]
	@UserId int

as

/* --- TEST ---

	DECLARE @UserId int = 576

	EXECUTE [dbo].[Messages_Select_UniqueByUserId]
		@UserId

*/

BEGIN

	SELECT   DISTINCT 
		  m.RecipientId
			,ur.FirstName
			,ur.LastName
			,ur.AvatarUrl



	FROM [dbo].[Messages] AS m
	INNER JOIN [dbo].[Users] AS ur
	  ON m.RecipientId = ur.Id
	INNER JOIN [dbo].[Users] AS us
	  ON m.SenderId = us.Id  

	WHERE  m.SenderId = @UserId 

	UNION 

	SELECT   DISTINCT 
		  m.SenderId
		  ,us.FirstName
			,us.LastName
			,us.AvatarUrl


	FROM [dbo].[Messages] AS m
	INNER JOIN [dbo].[Users] AS ur
	  ON m.RecipientId = ur.Id
	INNER JOIN [dbo].[Users] AS us
	  ON m.SenderId = us.Id  

	WHERE  m.RecipientId = @UserId

END
